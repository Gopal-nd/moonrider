import { Router } from "express";
import {
  getNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationCount,
} from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth.middleware";

const notificationRoutes = Router();

// Apply authentication middleware to all notification routes
notificationRoutes.use(authenticate);

// Notification routes
notificationRoutes.get("/", getNotifications);
notificationRoutes.get("/count", getNotificationCount);
notificationRoutes.get("/:id", getNotificationById);
notificationRoutes.post("/", createNotification);
notificationRoutes.put("/:id/read", markAsRead);
notificationRoutes.put("/read-all", markAllAsRead);
notificationRoutes.delete("/:id", deleteNotification);

export default notificationRoutes;
