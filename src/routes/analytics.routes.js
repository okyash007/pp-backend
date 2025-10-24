import express from "express";
import { getAnalyticsController } from "../controllers/analytics.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, getAnalyticsController);

export default router;