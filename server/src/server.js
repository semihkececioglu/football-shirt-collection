import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Logger Middleware (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "⚽ Football Shirt Collection API",
    version: "1.0.0",
    status: "Running",
  });
});

// 404 Handler (Express 5 uyumlu)
app.use(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// API Routes (will be added later)
// app.use('/api/auth', authRoutes);
// app.use('/api/shirts', shirtRoutes);
// app.use('/api/wishlist', wishlistRoutes);
// app.use('/api/stats', statsRoutes);

// Error Handler Middleware (will be added later)
// app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  console.log(`📍 API URL: http://localhost:${PORT}`);
});
