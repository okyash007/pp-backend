import express from "express";
import { getAnalyticsController } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", getAnalyticsController);

export default router;