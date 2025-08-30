import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get all customers with pagination and search
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { page = 1, limit = 10, search = "", status = "" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId };
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { orders: true }
          }
        }
      }),
      prisma.customer.count({ where })
    ]);

    res.json({
      customers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

// Get customer by ID
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const customer = await prisma.customer.findFirst({
      where: { id, userId },
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                product: true
              }
            }
          },
          orderBy: { orderDate: 'desc' }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
};

// Create new customer
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, email, phone, address, city, country, status } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if email already exists for this user
    const existingCustomer = await prisma.customer.findFirst({
      where: { email, userId }
    });

    if (existingCustomer) {
      return res.status(400).json({ error: "Customer with this email already exists" });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        city,
        country,
        status: status || "active",
        userId
      }
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Failed to create customer" });
  }
};

// Update customer
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { name, email, phone, address, city, country, status } = req.body;

    const customer = await prisma.customer.findFirst({
      where: { id, userId }
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Check if email already exists for another customer
    if (email && email !== customer.email) {
      const existingCustomer = await prisma.customer.findFirst({
        where: { email, userId, NOT: { id } }
      });

      if (existingCustomer) {
        return res.status(400).json({ error: "Customer with this email already exists" });
      }
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        city,
        country,
        status
      }
    });

    res.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Failed to update customer" });
  }
};

// Delete customer
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const customer = await prisma.customer.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    if (customer._count.orders > 0) {
      return res.status(400).json({ 
        error: "Cannot delete customer with existing orders" 
      });
    }

    await prisma.customer.delete({
      where: { id }
    });

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
};

// Get customer analytics
export const getCustomerAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [totalCustomers, activeCustomers, vipCustomers, totalRevenue] = await Promise.all([
      prisma.customer.count({ where: { userId } }),
      prisma.customer.count({ where: { userId, status: "active" } }),
      prisma.customer.count({ where: { userId, status: "vip" } }),
      prisma.customer.aggregate({
        where: { userId },
        _sum: { totalSpent: true }
      })
    ]);

    const topCustomers = await prisma.customer.findMany({
      where: { userId },
      orderBy: { totalSpent: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        totalSpent: true,
        _count: { select: { orders: true } }
      }
    });

    const customerGrowth = await prisma.customer.groupBy({
      by: ['createdAt'],
      where: { userId },
      _count: true,
      orderBy: { createdAt: 'asc' }
    });

    res.json({
      totalCustomers,
      activeCustomers,
      vipCustomers,
      totalRevenue: totalRevenue._sum.totalSpent || 0,
      topCustomers,
      customerGrowth
    });
  } catch (error) {
    console.error("Error fetching customer analytics:", error);
    res.status(500).json({ error: "Failed to fetch customer analytics" });
  }
};
