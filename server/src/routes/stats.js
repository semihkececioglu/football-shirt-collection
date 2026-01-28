import express from "express";
import {
  getOverviewStats,
  getByTypeStats,
  getBySeasonStats,
  getByBrandStats,
  getByConditionStats,
  getRecentShirts,
  getMostValuableShirts,
  getByCompetitionStats,
  getBySizeStats,
  getMostTeamsStats,
  exportAllShirts,
} from "../controllers/statsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

/**
 * @swagger
 * /api/stats/overview:
 *   get:
 *     summary: Get collection overview statistics
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview statistics
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
 *                     totalShirts:
 *                       type: integer
 *                     totalValue:
 *                       type: number
 *                     totalInvested:
 *                       type: number
 *                     averageValue:
 *                       type: number
 *                     favorites:
 *                       type: integer
 */
router.get("/overview", getOverviewStats);

/**
 * @swagger
 * /api/stats/by-type:
 *   get:
 *     summary: Get shirts grouped by type
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shirts by type statistics
 */
router.get("/by-type", getByTypeStats);

/**
 * @swagger
 * /api/stats/by-season:
 *   get:
 *     summary: Get shirts grouped by season
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shirts by season statistics
 */
router.get("/by-season", getBySeasonStats);

/**
 * @swagger
 * /api/stats/by-brand:
 *   get:
 *     summary: Get shirts grouped by brand
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shirts by brand statistics
 */
router.get("/by-brand", getByBrandStats);

/**
 * @swagger
 * /api/stats/by-condition:
 *   get:
 *     summary: Get shirts grouped by condition
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shirts by condition statistics
 */
router.get("/by-condition", getByConditionStats);

/**
 * @swagger
 * /api/stats/by-competition:
 *   get:
 *     summary: Get shirts grouped by competition
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shirts by competition statistics
 */
router.get("/by-competition", getByCompetitionStats);

/**
 * @swagger
 * /api/stats/by-size:
 *   get:
 *     summary: Get shirts grouped by size
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shirts by size statistics
 */
router.get("/by-size", getBySizeStats);

/**
 * @swagger
 * /api/stats/most-teams:
 *   get:
 *     summary: Get teams with most shirts
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teams with most shirts
 */
router.get("/most-teams", getMostTeamsStats);

/**
 * @swagger
 * /api/stats/recent:
 *   get:
 *     summary: Get recently added shirts
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of shirts to return
 *     responses:
 *       200:
 *         description: Recent shirts
 */
router.get("/recent", getRecentShirts);

/**
 * @swagger
 * /api/stats/most-valuable:
 *   get:
 *     summary: Get most valuable shirts
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of shirts to return
 *     responses:
 *       200:
 *         description: Most valuable shirts
 */
router.get("/most-valuable", getMostValuableShirts);

/**
 * @swagger
 * /api/stats/export:
 *   get:
 *     summary: Export all shirts as JSON
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All shirts data for export
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
 */
router.get("/export", exportAllShirts);

export default router;
