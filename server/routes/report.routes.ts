import { Router } from "express";
import {
  getReports,
  getReportById,
  generateSalesReport,
  generateInventoryReport,
  generateCustomerReport,
  deleteReport,
} from "../controllers/report.controller";
import { authenticate } from "../middleware/auth.middleware";

const reportRoutes = Router();

// Apply authentication middleware to all report routes
reportRoutes.use(authenticate);

// Report routes
reportRoutes.get("/", getReports);
reportRoutes.get("/:id", getReportById);
reportRoutes.post("/sales", generateSalesReport);
reportRoutes.post("/inventory", generateInventoryReport);
reportRoutes.post("/customer", generateCustomerReport);
reportRoutes.delete("/:id", deleteReport);

export default reportRoutes;
