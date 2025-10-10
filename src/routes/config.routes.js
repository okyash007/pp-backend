import express from "express";
import { createConfigController, getConfigController, updateConfigController } from "../controllers/config.controller.js";

const router = express.Router();

router.post("/", createConfigController);
router.get("/:id", getConfigController);
router.put("/:id", updateConfigController);

export default router;