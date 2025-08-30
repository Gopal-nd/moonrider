import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get all orders with pagination and filters
export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { page = 1, limit = 10, status = "", customerId = "" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId };
    
    if (status) {
      where.status = status;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { orderDate: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true
                }
              }
            }
          },
          _count: {
            select: { orderItems: true }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Create new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { customerId, orderItems, shippingAddress, paymentMethod } = req.body;

    if (!customerId || !orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "Customer ID and order items are required" });
    }

    // Verify customer exists and belongs to user
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, userId }
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Calculate total amount and verify products
    let totalAmount = 0;
    for (const item of orderItems) {
      const product = await prisma.product.findFirst({
        where: { id: item.productId, userId }
      });

      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      if (product.stock !== null && product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for product ${product.name}` 
        });
      }

      totalAmount += product.price! * item.quantity;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create order with transaction
    const order = await prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          orderNumber,
          customerId,
          totalAmount,
          shippingAddress,
          paymentMethod,
          userId
        }
      });

      // Create order items
      const orderItemData = orderItems.map((item: any) => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      }));

      await prisma.orderItem.createMany({
        data: orderItemData
      });

      // Update product stock
      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // Update customer total spent
      await prisma.customer.update({
        where: { id: customerId },
        data: {
          totalSpent: {
            increment: totalAmount
          },
          lastOrder: new Date()
        }
      });

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { status, deliveryDate } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const order = await prisma.order.findFirst({
      where: { id, userId }
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const updateData: any = { status };
    if (status === 'delivered' && deliveryDate) {
      updateData.deliveryDate = new Date(deliveryDate);
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

// Delete order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        orderItems: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ 
        error: "Cannot delete order that is not pending" 
      });
    }

    // Delete order with transaction to restore stock
    await prisma.$transaction(async (prisma) => {
      // Restore product stock
      for (const item of order.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }

      // Delete order items
      await prisma.orderItem.deleteMany({
        where: { orderId: id }
      });

      // Delete order
      await prisma.order.delete({
        where: { id }
      });

      // Update customer total spent
      await prisma.customer.update({
        where: { id: order.customerId },
        data: {
          totalSpent: {
            decrement: order.totalAmount
          }
        }
      });
    });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

// Get order analytics
export const getOrderAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [totalOrders, pendingOrders, completedOrders, totalRevenue] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.count({ where: { userId, status: "pending" } }),
      prisma.order.count({ where: { userId, status: "delivered" } }),
      prisma.order.aggregate({
        where: { userId },
        _sum: { totalAmount: true }
      })
    ]);

    const monthlyRevenue = await prisma.order.groupBy({
      by: ['orderDate'],
      where: { userId },
      _sum: { totalAmount: true },
      orderBy: { orderDate: 'asc' }
    });

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: { userId }
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    });

    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, price: true }
        });
        return {
          productId: item.productId,
          productName: product?.name || 'Unknown',
          totalQuantity: item._sum.quantity || 0,
          totalRevenue: (item._sum.quantity || 0) * (product?.price || 0)
        };
      })
    );

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      monthlyRevenue,
      topProducts: topProductsWithDetails
    });
  } catch (error) {
    console.error("Error fetching order analytics:", error);
    res.status(500).json({ error: "Failed to fetch order analytics" });
  }
};
