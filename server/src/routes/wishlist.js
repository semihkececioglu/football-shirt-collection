import express from "express";
import {
  getWishlist,
  getWishlistItem,
  createWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.route("/").get(getWishlist).post(createWishlistItem);

router
  .route("/:id")
  .get(getWishlistItem)
  .put(updateWishlistItem)
  .delete(deleteWishlistItem);

export default router;
