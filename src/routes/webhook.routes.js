import express from "express";
import catchAsync from "../utils/catchAsync.js";
import Creator from "../models/creator.js";

const router = express.Router();

router.post(
  "/razorpay/subscription",
  catchAsync(async (req, res) => {
    const { event } = req.body;
    if (event === "subscription.activated") {
      const updatedCreator = await Creator.findOneAndUpdate(
        { subscription_id: req.body.payload.subscription.entity.id },
        { subscription_status: "pro" },
        { new: true }
      );
      if (updatedCreator) {
        res
          .status(200)
          .json({ message: "Creator subscription activated successfully" });
      } else {
        res.status(404).json({ message: "Creator not found" });
      }
    } else if (event === "subscription.cancelled") {
      const updatedCreator = await Creator.findOneAndUpdate(
        { subscription_id: req.body.payload.subscription.entity.id },
        { subscription_status: "free" },
        { new: true }
      );
      if (updatedCreator) {
        res
          .status(200)
          .json({ message: "Creator subscription cancelled successfully" });
      } else {
        res.status(404).json({ message: "Creator not found" });
      }
    } else if (event === "subscription.paused") {
      const updatedCreator = await Creator.findOneAndUpdate(
        { subscription_id: req.body.payload.subscription.entity.id },
        { subscription_status: "free" },
        { new: true }
      );
      if (updatedCreator) {
        res
          .status(200)
          .json({ message: "Creator subscription paused successfully" });
      } else {
        res.status(404).json({ message: "Creator not found" });
      }
    } else if (event === "subscription.resumed") {
      const updatedCreator = await Creator.findOneAndUpdate(
        { subscription_id: req.body.payload.subscription.entity.id },
        { subscription_status: "pro" },
        { new: true }
      );
      if (updatedCreator) {
        res
          .status(200)
          .json({ message: "Creator subscription resumed successfully" });
      } else {
        res.status(404).json({ message: "Creator not found" });
      }
    } else if (event === "subscription.expired") {
      const updatedCreator = await Creator.findOneAndUpdate(
        { subscription_id: req.body.payload.subscription.entity.id },
        { subscription_status: "free" },
        { new: true }
      );
      if (updatedCreator) {
        res
          .status(200)
          .json({ message: "Creator subscription expired successfully" });
      } else {
        res.status(404).json({ message: "Creator not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid event" });
    }
  })
);

export default router;
