import express from "express";
import { getConfigController, updateConfigController } from "../controllers/config.controller.js";

const router = express.Router();

router.get("/:id", getConfigController);
router.put("/:id", updateConfigController);

export default router;