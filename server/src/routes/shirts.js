import express from "express";
import {
  createShirt,
  getShirts,
  getShirtById,
  updateShirt,
  deleteShirt,
  toggleFavorite,
  getFilterOptions,
} from "../controllers/shirtController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// IMPORTANT: Specific routes BEFORE parameterized routes
// Get filter options (must be before /:id)
router.get("/filters/options", getFilterOptions);

// Main CRUD routes
router.route("/").get(getShirts).post(upload.array("images", 5), createShirt);

// Toggle favorite (must be before /:id to avoid conflict)
router.patch("/:id/favorite", toggleFavorite);

// Parameterized routes (must be last)
router
  .route("/:id")
  .get(getShirtById)
  .put(upload.array("images", 5), updateShirt)
  .delete(deleteShirt);

export default router;
