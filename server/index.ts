import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import customerRoutes from "./routes/customer.routes";
import orderRoutes from "./routes/order.routes";
import reportRoutes from "./routes/report.routes";
import notificationRoutes from "./routes/notification.routes";
import userRoutes from "./routes/user.routes";
import { generateToken } from "./lib/jwt";

dotenv.config();
const app = express();
app.set("trust proxy", 1);
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

app.use(cors({ origin: [`${process.env.FRONTEND_URL}`], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/user", userRoutes);

app.listen(8000, () => console.log("Server running on http://localhost:8000"));
