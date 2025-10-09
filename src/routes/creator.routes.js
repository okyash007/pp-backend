import express from "express";
import {
  signupCreator,
  loginCreator,
  getCreatorProfile,
  updateCreatorProfile,
} from "../controllers/creator.controllers.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate, signupSchema, loginSchema, updateProfileSchema } from "../validations/creator.validation.js";

const router = express.Router();

// Public routes
router.post("/signup", validate(signupSchema), signupCreator);
router.post("/login", validate(loginSchema), loginCreator);

// Protected routes (require authentication middleware)
router.get("/profile", authenticateToken, getCreatorProfile);
router.put("/profile", authenticateToken, validate(updateProfileSchema), updateCreatorProfile);

export default router;
