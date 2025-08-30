import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get user settings
export const getUserSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let settings = await prisma.userSettings.findUnique({
      where: { userId }
    });

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId,
          theme: "light",
          language: "en",
          emailNotifications: true,
          pushNotifications: true,
          dashboardLayout: JSON.stringify({
            metrics: { x: 0, y: 0, w: 4, h: 2 },
            activities: { x: 0, y: 2, w: 2, h: 3 },
            products: { x: 2, y: 2, w: 2, h: 3 }
          })
        }
      });
    }

    res.json(settings);
  } catch (error) {
    console.error("Error fetching user settings:", error);
    res.status(500).json({ error: "Failed to fetch user settings" });
  }
};

// Update user settings
export const updateUserSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { theme, language, emailNotifications, pushNotifications, dashboardLayout } = req.body;

    let settings = await prisma.userSettings.findUnique({
      where: { userId }
    });

    if (settings) {
      // Update existing settings
      settings = await prisma.userSettings.update({
        where: { userId },
        data: {
          theme,
          language,
          emailNotifications,
          pushNotifications,
          dashboardLayout: dashboardLayout ? JSON.stringify(dashboardLayout) : undefined
        }
      });
    } else {
      // Create new settings
      settings = await prisma.userSettings.create({
        data: {
          userId,
          theme: theme || "light",
          language: language || "en",
          emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
          pushNotifications: pushNotifications !== undefined ? pushNotifications : true,
          dashboardLayout: dashboardLayout ? JSON.stringify(dashboardLayout) : JSON.stringify({
            metrics: { x: 0, y: 0, w: 4, h: 2 },
            activities: { x: 0, y: 2, w: 2, h: 3 },
            products: { x: 2, y: 2, w: 2, h: 3 }
          })
        }
      });
    }

    res.json(settings);
  } catch (error) {
    console.error("Error updating user settings:", error);
    res.status(500).json({ error: "Failed to update user settings" });
  }
};

// Reset user settings to default
export const resetUserSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const defaultSettings = {
      theme: "light",
      language: "en",
      emailNotifications: true,
      pushNotifications: true,
      dashboardLayout: JSON.stringify({
        metrics: { x: 0, y: 0, w: 4, h: 2 },
        activities: { x: 0, y: 2, w: 2, h: 3 },
        products: { x: 2, y: 2, w: 2, h: 3 }
      })
    };

    let settings = await prisma.userSettings.findUnique({
      where: { userId }
    });

    if (settings) {
      settings = await prisma.userSettings.update({
        where: { userId },
        data: defaultSettings
      });
    } else {
      settings = await prisma.userSettings.create({
        data: {
          userId,
          ...defaultSettings
        }
      });
    }

    res.json(settings);
  } catch (error) {
    console.error("Error resetting user settings:", error);
    res.status(500).json({ error: "Failed to reset user settings" });
  }
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        settings: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, avatar } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        avatar
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
};

// Get user statistics
export const getUserStatistics = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [totalProducts, totalCustomers, totalOrders, totalRevenue] = await Promise.all([
      prisma.product.count({ where: { userId } }),
      prisma.customer.count({ where: { userId } }),
      prisma.order.count({ where: { userId } }),
      prisma.order.aggregate({
        where: { userId },
        _sum: { totalAmount: true }
      })
    ]);

    res.json({
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ error: "Failed to fetch user statistics" });
  }
};
