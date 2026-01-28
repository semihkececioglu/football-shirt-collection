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

/**
 * @swagger
 * /api/shirts/filters/options:
 *   get:
 *     summary: Get filter options for shirts
 *     tags: [Shirts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Filter options
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     teams:
 *                       type: array
 *                       items:
 *                         type: string
 *                     brands:
 *                       type: array
 *                       items:
 *                         type: string
 *                     seasons:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.get("/filters/options", getFilterOptions);

/**
 * @swagger
 * /api/shirts:
 *   get:
 *     summary: Get all shirts for current user
 *     tags: [Shirts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by team name
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [home, away, third, fourth, fifth, goalkeeper, special, anniversary]
 *         description: Filter by shirt type
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand
 *       - in: query
 *         name: season
 *         schema:
 *           type: string
 *         description: Filter by season (e.g., 2023/24)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, teamName, purchaseDate, purchasePrice]
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of shirts
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
 *                     $ref: '#/components/schemas/Shirt'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *   post:
 *     summary: Create a new shirt
 *     tags: [Shirts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - teamName
 *               - season
 *               - condition
 *             properties:
 *               teamName:
 *                 type: string
 *               season:
 *                 type: string
 *                 example: "2023/24"
 *               type:
 *                 type: string
 *                 enum: [home, away, third, fourth, fifth, goalkeeper, special, anniversary]
 *               brand:
 *                 type: string
 *               size:
 *                 type: string
 *                 enum: [XS, S, M, L, XL, XXL, XXXL, +4XL]
 *               condition:
 *                 type: string
 *                 enum: [brandNewTags, brandNew, mint, excellent, good, fair, poor]
 *               playerName:
 *                 type: string
 *               playerNumber:
 *                 type: integer
 *               purchasePrice:
 *                 type: number
 *               currentValue:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Shirt created successfully
 *       400:
 *         description: Validation error
 */
router.route("/").get(getShirts).post(upload.array("images", 5), createShirt);

/**
 * @swagger
 * /api/shirts/{id}/favorite:
 *   patch:
 *     summary: Toggle favorite status
 *     tags: [Shirts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shirt ID
 *     responses:
 *       200:
 *         description: Favorite status toggled
 *       404:
 *         description: Shirt not found
 */
router.patch("/:id/favorite", toggleFavorite);

/**
 * @swagger
 * /api/shirts/{id}:
 *   get:
 *     summary: Get shirt by ID
 *     tags: [Shirts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shirt ID
 *     responses:
 *       200:
 *         description: Shirt details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Shirt'
 *       404:
 *         description: Shirt not found
 *   put:
 *     summary: Update shirt
 *     tags: [Shirts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shirt ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               teamName:
 *                 type: string
 *               season:
 *                 type: string
 *               type:
 *                 type: string
 *               brand:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Shirt updated successfully
 *       404:
 *         description: Shirt not found
 *   delete:
 *     summary: Delete shirt
 *     tags: [Shirts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shirt ID
 *     responses:
 *       200:
 *         description: Shirt deleted successfully
 *       404:
 *         description: Shirt not found
 */
router
  .route("/:id")
  .get(getShirtById)
  .put(upload.array("images", 5), updateShirt)
  .delete(deleteShirt);

export default router;
