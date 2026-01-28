import jwt from "jsonwebtoken";
import User from "../models/Users.js";

export const protect = async (req, res, next) => {
  console.log("🔐 Auth middleware called for:", req.method, req.path);

  // Check for token in header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    console.log("❌ No token provided");
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }

  try {
    // Get token from header
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      console.log("❌ User not found for token");
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }

    console.log("✅ Auth successful for user:", req.user._id);
    return next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};
