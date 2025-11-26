import express from "express";
import creatorRoutes from "./creator.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import tipRoutes from "./tip.routes.js";
import uploadRoutes from "./upload.routes.js";
import linkTreeRoutes from "./linkTree.routes.js";
import tipPageRoutes from "./tip-page.routes.js";
import overlayRoutes from "./overlay.routes.js";
import onboardingRoutes from "./onboarding.routes.js";
import ttsRoutes from "./tts.routes.js";
import ticketRoutes from "./ticket.routes.js";
import { createRouteAccount, deleteRouteAccount } from "../services/razorpay.service.js";

const router = express.Router();

router.use("/creator", creatorRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/tip", tipRoutes);
router.use("/upload", uploadRoutes);
router.use("/link-tree", linkTreeRoutes);
router.use("/tip-page", tipPageRoutes);
router.use("/overlay", overlayRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/tts", ttsRoutes);
router.use("/ticket", ticketRoutes);

export default router;
