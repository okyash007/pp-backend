import express from "express";
import { getTipsController } from "../controllers/tip.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/tip/:creator_id - Get tips for a specific creator with pagination and sorting
router.get("/", authenticateToken, getTipsController);

export default router;
