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

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get all wishlist items
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wishlist items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WishlistItem'
 *   post:
 *     summary: Create a wishlist item
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamName
 *             properties:
 *               teamName:
 *                 type: string
 *                 example: Real Madrid
 *               season:
 *                 type: string
 *                 example: "2024/25"
 *               type:
 *                 type: string
 *                 enum: [home, away, third, goalkeeper, special]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: medium
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Wishlist item created
 *       400:
 *         description: Validation error
 */
router.route("/").get(getWishlist).post(createWishlistItem);

/**
 * @swagger
 * /api/wishlist/{id}:
 *   get:
 *     summary: Get wishlist item by ID
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wishlist item ID
 *     responses:
 *       200:
 *         description: Wishlist item details
 *       404:
 *         description: Item not found
 *   put:
 *     summary: Update wishlist item
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wishlist item ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamName:
 *                 type: string
 *               season:
 *                 type: string
 *               type:
 *                 type: string
 *               priority:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Item not found
 *   delete:
 *     summary: Delete wishlist item
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wishlist item ID
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 */
router
  .route("/:id")
  .get(getWishlistItem)
  .put(updateWishlistItem)
  .delete(deleteWishlistItem);

export default router;
