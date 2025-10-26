import express from "express";
import {
  getOnboardingController,
  updateOnboardingController,
} from "../controllers/onboarding.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/tip/:creator_id - Get tips for a specific creator with pagination and sorting
router.get("/", authenticateToken, getOnboardingController);

// PUT /api/tip/:creator_id - Update tips for a specific creator with pagination and sorting
router.put("/", authenticateToken, updateOnboardingController);
export default router;
