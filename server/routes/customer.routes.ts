import { Router } from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerAnalytics,
} from "../controllers/customer.controller";
import { authenticate } from "../middleware/auth.middleware";

const customerRoutes = Router();

// Apply authentication middleware to all customer routes
customerRoutes.use(authenticate);

// Customer CRUD routes
customerRoutes.get("/", getCustomers);
customerRoutes.get("/analytics", getCustomerAnalytics);
customerRoutes.get("/:id", getCustomerById);
customerRoutes.post("/", createCustomer);
customerRoutes.put("/:id", updateCustomer);
customerRoutes.delete("/:id", deleteCustomer);

export default customerRoutes;
