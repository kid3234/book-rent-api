import express from "express";
import { limiter } from "../middlewares/rateLimitMiddleware.js";
import authRoutes from "../routes/authRoutes.js";
import { connectDB } from "../config/dbConnect.js";
import userRouter from "../routes/userRoutes.js";
import bookRoutes from "../routes/bookRoutes.js";
import dotenv from "dotenv";
import { globalErrorHandler, notFound } from "../middlewares/globalErrorHandler.js";
import cors from 'cors'
dotenv.config();
connectDB().catch(err => console.error('Database connection failed:', err));

const app = express();


app.use(cors());

// Optionally, configure CORS to allow specific origins and methods
app.use(cors({
  origin: '*', // Replace with your allowed origin
  methods: 'GET,POST,PUT,DELETE,Patch', // Specify allowed methods
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(limiter);


app.use("/api/V1/auth", authRoutes);
app.use("/api/V1/users", userRouter);
app.use("/api/V1/books", bookRoutes);

app.use("/", (req,res)=>{
  res.json({
    message:'hi chubaw'
  })
  });

app.use(notFound);
app.use(globalErrorHandler)

export default app;
