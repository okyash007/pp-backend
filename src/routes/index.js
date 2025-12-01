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
import notificationRoutes from "./notification.routes.js";
import getRazorpayInstance, {
  createRouteAccount,
  createSubscription,
  deleteRouteAccount,
} from "../services/razorpay.service.js";
import sendEmail from "../services/email.service.js";
import webhookRoutes from "./webhook.routes.js";

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
router.use("/notification", notificationRoutes);
router.use("/webhook", webhookRoutes);

router.get("/email", async (req, res) => {
  const result = await sendEmail(
    "8006679475yash@gmail.com",
    "<h1>Hello</h1><p>This is an HTML email.</p>"
  );
  res.json(result);
});
router.get("/test-subscription", async (req, res) => {

  const subscription = await createSubscription({
    plan_id: "plan_RkSauBrurSpcGQ",
    total_count: 12,
    quantity: 1,
    customer_notify: 1,
  });
  res.json(subscription);
});

export default router;
