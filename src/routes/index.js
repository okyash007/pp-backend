import express from "express";
import creatorRoutes from "./creator.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import tipRoutes from "./tip.routes.js";
import uploadRoutes from "./upload.routes.js";
import linkTreeRoutes from "./linkTree.routes.js";
import tipPageRoutes from "./tip-page.routes.js";
import overlayRoutes from "./overlay.routes.js";
import onboardingRoutes from "./onboarding.routes.js";
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

router.get("/test", async (req, res) => {
    try {
        const response = await createRouteAccount({
            email: "helloyashverma@gmail.com",
            phone: "8006679475",
            legal_business_name: "Yash Verma",
            // settlement_info: {
            //     account_type: "bank_account",
            //     bank_account: {
            //         account_number: "110222002734",
            //         ifsc: "CNRB0018551",
            //         account_holder_name: "Yash Verma",
            //     },
            // },
        });
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
});

export default router;
