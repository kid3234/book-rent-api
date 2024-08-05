import express from "express";
import { limiter } from "../middlewares/rateLimitMiddleware.js";
import authRoutes from "../routes/authRoutes.js";
import { connectDB } from "../config/dbConnect.js";
import userRouter from "../routes/userRoutes.js";
import bookRoutes from "../routes/bookRoutes.js";
import dotenv from "dotenv";
import { globalErrorHandler, notFound } from "../middlewares/globalErrorHandler.js";

dotenv.config();
connectDB().catch(err => console.error('Database connection failed:', err));

const app = express();

app.use(express.json());
app.use(limiter);

app.use("/api/V1/auth", authRoutes);
app.use("/api/V1/users", userRouter);
app.use("/api/V1/books", bookRoutes);

app.use(notFound);
app.use(globalErrorHandler)

export default app;
