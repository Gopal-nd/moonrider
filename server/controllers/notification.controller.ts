import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get all notifications with pagination
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId };
    
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where })
    ]);

    res.json({
      notifications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Get notification by ID
export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ error: "Failed to fetch notification" });
  }
};

// Create notification
export const createNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, message, type = "info" } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        userId
      }
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    res.json(updatedNotification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await prisma.notification.delete({
      where: { id }
    });

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

// Get notification count
export const getNotificationCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [unreadCount, totalCount] = await Promise.all([
      prisma.notification.count({
        where: { userId, isRead: false }
      }),
      prisma.notification.count({
        where: { userId }
      })
    ]);

    res.json({
      unreadCount,
      totalCount
    });
  } catch (error) {
    console.error("Error fetching notification count:", error);
    res.status(500).json({ error: "Failed to fetch notification count" });
  }
};

// Create system notification (for low stock, etc.)
export const createSystemNotification = async (userId: string, title: string, message: string, type: string = "warning") => {
  try {
    await prisma.notification.create({
      data: {
        title,
        message,
        type,
        userId
      }
    });
  } catch (error) {
    console.error("Error creating system notification:", error);
  }
};
