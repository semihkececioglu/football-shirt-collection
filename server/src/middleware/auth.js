import jwt from "jsonwebtoken";
import User from "../models/Users.js";

export const protect = async (req, res, next) => {
  console.log("🔐 Auth middleware called for:", req.method, req.path);
  let token;

  // Check for token in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      console.log("✅ Auth successful for user:", req.user?._id);
      next();
    } catch (error) {
      console.error("❌ Auth error:", error.message);
      res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    console.log("❌ No token provided");
    res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
};
