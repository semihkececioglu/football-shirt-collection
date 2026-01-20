import express from "express";
import {
  register,
  login,
  googleAuth,
  checkUsername,
  setUsername,
  getProfile,
  updateProfile,
  updateAvatar,
  changePassword,
  deleteAccount,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/check-username/:username", checkUsername);
router.put("/set-username", protect, setUsername);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/avatar", protect, upload.single("avatar"), updateAvatar);
router.put("/change-password", protect, changePassword);
router.delete("/account", protect, deleteAccount);

export default router;
