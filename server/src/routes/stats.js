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

router.get("/overview", getOverviewStats);
router.get("/by-type", getByTypeStats);
router.get("/by-season", getBySeasonStats);
router.get("/by-brand", getByBrandStats);
router.get("/by-condition", getByConditionStats);
router.get("/by-competition", getByCompetitionStats);
router.get("/by-size", getBySizeStats);
router.get("/most-teams", getMostTeamsStats);
router.get("/recent", getRecentShirts);
router.get("/most-valuable", getMostValuableShirts);
router.get("/export", exportAllShirts);

export default router;
