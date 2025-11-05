import express from "express";
import { getAmountsByCreatorIdController, getTipsByCreatorIdController, getTipsController, getUnsettledTipsController } from "../controllers/tip.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/tip/:creator_id - Get tips for a specific creator with pagination and sorting
router.get("/", authenticateToken, getTipsController);
router.get("/:creator_id", getTipsByCreatorIdController);
router.get("/:creator_id/unsettled", getUnsettledTipsController);
router.get("/:creator_id/amounts", getAmountsByCreatorIdController);

export default router;
