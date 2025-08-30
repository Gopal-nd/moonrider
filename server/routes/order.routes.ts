import { Router } from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderAnalytics,
} from "../controllers/order.controller";
import { authenticate } from "../middleware/auth.middleware";

const orderRoutes = Router();

// Apply authentication middleware to all order routes
orderRoutes.use(authenticate);

// Order CRUD routes
orderRoutes.get("/", getOrders);
orderRoutes.get("/analytics", getOrderAnalytics);
orderRoutes.get("/:id", getOrderById);
orderRoutes.post("/", createOrder);
orderRoutes.put("/:id/status", updateOrderStatus);
orderRoutes.delete("/:id", deleteOrder);

export default orderRoutes;
