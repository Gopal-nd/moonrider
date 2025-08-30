import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get dashboard metrics
export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const metrics = await prisma.metric.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 4
    });

    // Group metrics by type and get the latest value for each
    const latestMetrics = {
      totalRevenues: { value: 0, change: 0 },
      totalTransactions: { value: 0, change: 0 },
      totalLikes: { value: 0, change: 0 },
      totalUsers: { value: 0, change: 0 }
    };

    metrics.forEach(metric => {
      switch (metric.type) {
        case 'revenue':
          latestMetrics.totalRevenues = { value: metric.value, change: metric.change };
          break;
        case 'transactions':
          latestMetrics.totalTransactions = { value: metric.value, change: metric.change };
          break;
        case 'likes':
          latestMetrics.totalLikes = { value: metric.value, change: metric.change };
          break;
        case 'users':
          latestMetrics.totalUsers = { value: metric.value, change: metric.change };
          break;
      }
    });

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

    const { name, percentage, color } = req.body;

    if (!name || percentage === undefined || !color) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        percentage,
        color,
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
    const { name, percentage, color } = req.body;

    const product = await prisma.product.findFirst({
      where: { id, userId }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, percentage, color }
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
