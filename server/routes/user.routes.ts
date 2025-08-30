import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserSettings,
  updateUserSettings,
  resetUserSettings,
  getUserStatistics,
} from "../controllers/userSettings.controller";
import { authenticate } from "../middleware/auth.middleware";

const userRoutes = Router();

// Apply authentication middleware to all user routes
userRoutes.use(authenticate);

// User profile and settings routes
userRoutes.get("/profile", getUserProfile);
userRoutes.put("/profile", updateUserProfile);
userRoutes.get("/settings", getUserSettings);
userRoutes.put("/settings", updateUserSettings);
userRoutes.post("/settings/reset", resetUserSettings);
userRoutes.get("/statistics", getUserStatistics);

export default userRoutes;
