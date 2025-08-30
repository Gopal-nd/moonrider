import type { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get dashboard metrics
export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get actual data from database to calculate metrics
    const [orders, customers, products, activities] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        select: { totalAmount: true, orderDate: true }
      }),
      prisma.customer.findMany({
        where: { userId },
        select: { totalSpent: true, createdAt: true }
      }),
      prisma.product.findMany({
        where: { userId },
        select: { price: true, createdAt: true }
      }),
      prisma.activity.findMany({
        where: { userId },
        select: { guest: true, userCount: true, date: true }
      })
    ]);

    // Calculate current values
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const totalProducts = products.length;

    // Calculate previous period values (last 7 days vs previous 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const currentPeriodOrders = orders.filter(order => 
      new Date(order.orderDate) >= sevenDaysAgo
    );
    const previousPeriodOrders = orders.filter(order => 
      new Date(order.orderDate) >= fourteenDaysAgo && new Date(order.orderDate) < sevenDaysAgo
    );

    const currentPeriodRevenue = currentPeriodOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const previousPeriodRevenue = previousPeriodOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Calculate change percentages
    const revenueChange = previousPeriodRevenue > 0 
      ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 
      : 0;

    const ordersChange = previousPeriodOrders.length > 0 && previousPeriodOrders.length > 0
      ? ((currentPeriodOrders.length - previousPeriodOrders.length) / previousPeriodOrders.length) * 100
      : 0;

    // For likes and users, we'll use activity data
    const currentPeriodActivity = activities.filter(activity => 
      new Date(activity.date) >= sevenDaysAgo
    );
    const previousPeriodActivity = activities.filter(activity => 
      new Date(activity.date) >= fourteenDaysAgo && new Date(activity.date) < sevenDaysAgo
    );

    const currentLikes = currentPeriodActivity.reduce((sum, activity) => sum + activity.guest, 0);
    const previousLikes = previousPeriodActivity.reduce((sum, activity) => sum + activity.guest, 0);
    const likesChange = previousLikes > 0 
      ? ((currentLikes - previousLikes) / previousLikes) * 100 
      : 0;

    const currentUsers = currentPeriodActivity.reduce((sum, activity) => sum + activity.userCount, 0);
    const previousUsers = previousPeriodActivity.reduce((sum, activity) => sum + activity.userCount, 0);
    const usersChange = previousUsers > 0 
      ? ((currentUsers - previousUsers) / previousUsers) * 100 
      : 0;

    const latestMetrics = {
      totalRevenues: { 
        value: Math.round(totalRevenue * 100) / 100, 
        change: Math.round(revenueChange * 100) / 100 
      },
      totalTransactions: { 
        value: totalOrders, 
        change: Math.round(ordersChange * 100) / 100 
      },
      totalLikes: { 
        value: currentLikes, 
        change: Math.round(likesChange * 100) / 100 
      },
      totalUsers: { 
        value: currentUsers, 
        change: Math.round(usersChange * 100) / 100 
      }
    };

    res.json(latestMetrics);
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({ error: "Failed to fetch dashboard metrics" });
  }
};

// Create or update metric
export const upsertMetric = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { type, value, change } = req.body;

    if (!type || value === undefined || change === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if metric exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingMetric = await prisma.metric.findFirst({
      where: {
        userId,
        type,
        date: {
          gte: today
        }
      }
    });

    let metric;
    if (existingMetric) {
      // Update existing metric
      metric = await prisma.metric.update({
        where: { id: existingMetric.id },
        data: { value, change }
      });
    } else {
      // Create new metric
      metric = await prisma.metric.create({
        data: {
          type,
          value,
          change,
          userId
        }
      });
    }

    res.json(metric);
  } catch (error) {
    console.error("Error upserting metric:", error);
    res.status(500).json({ error: "Failed to upsert metric" });
  }
};

// Get activities
export const getActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const activities = await prisma.activity.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 4
    });

    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
};

// Create activity
export const createActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { week, guest, userCount } = req.body;

    if (!week || guest === undefined || userCount === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const activity = await prisma.activity.create({
      data: {
        week,
        guest,
        userCount,
        userId
      }
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({ error: "Failed to create activity" });
  }
};

// Update activity
export const updateActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { week, guest, userCount } = req.body;

    const activity = await prisma.activity.findFirst({
      where: { id, userId }
    });

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    const updatedActivity = await prisma.activity.update({
      where: { id },
      data: { week, guest, userCount }
    });

    res.json(updatedActivity);
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({ error: "Failed to update activity" });
  }
};

// Delete activity
export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const activity = await prisma.activity.findFirst({
      where: { id, userId }
    });

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    await prisma.activity.delete({
      where: { id }
    });

    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ error: "Failed to delete activity" });
  }
};

// Get products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const products = await prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Create product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, percentage, color, price, category, stock, description, imageUrl } = req.body;

    if (!name || percentage === undefined || !color) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        percentage,
        color,
        price: price || 0,
        category: category || '',
        stock: stock || 0,
        description: description || '',
        imageUrl: imageUrl || '',
        userId
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { name, percentage, color, price, category, stock, description, imageUrl } = req.body;

    const product = await prisma.product.findFirst({
      where: { id, userId }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { 
        name, 
        percentage, 
        color, 
        price: price !== undefined ? price : product.price,
        category: category !== undefined ? category : product.category,
        stock: stock !== undefined ? stock : product.stock,
        description: description !== undefined ? description : product.description,
        imageUrl: imageUrl !== undefined ? imageUrl : product.imageUrl
      }
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: { id, userId }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
