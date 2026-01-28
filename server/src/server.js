import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  console.log(`📍 API URL: http://localhost:${PORT}`);
});
