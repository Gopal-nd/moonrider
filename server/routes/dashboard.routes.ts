import { Router } from "express";
import {
  getDashboardMetrics,
  upsertMetric,
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";

const dashboardRoutes = Router();

// Apply authentication middleware to all dashboard routes
dashboardRoutes.use(authenticate);

// Metrics routes
dashboardRoutes.get("/metrics", getDashboardMetrics);
dashboardRoutes.post("/metrics", upsertMetric);

// Activities routes
dashboardRoutes.get("/activities", getActivities);
dashboardRoutes.post("/activities", createActivity);
dashboardRoutes.put("/activities/:id", updateActivity);
dashboardRoutes.delete("/activities/:id", deleteActivity);

// Products routes
dashboardRoutes.get("/products", getProducts);
dashboardRoutes.post("/products", createProduct);
dashboardRoutes.put("/products/:id", updateProduct);
dashboardRoutes.delete("/products/:id", deleteProduct);

export default dashboardRoutes;
