import express from "express";
import {
  signupCreator,
  loginCreator,
  getCreatorProfile,
  updateCreatorProfile,
  verifyCreator,
  getAllCreatorsController,
} from "../controllers/creator.controllers.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  validate,
  signupSchema,
  loginSchema,
  updateProfileSchema,
} from "../validations/creator.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Creator
 *   description: Creator management endpoints
 */

// Public routes
/**
 * @swagger
 * /creator/signup:
 *   post:
 *     summary: Register a new creator
 *     tags: [Creator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *           example:
 *             username: "john_doe"
 *             firstName: "John"
 *             lastName: "Doe"
 *             email: "john.doe@example.com"
 *             password: "Password123"
 *             phone: "+1234567890"
 *     responses:
 *       201:
 *         description: Creator registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         creator:
 *                           $ref: '#/components/schemas/Creator'
 *                         token:
 *                           type: string
 *                           description: JWT authentication token
 *                         config:
 *                           $ref: '#/components/schemas/Config'
 *       400:
 *         description: Validation error or creator already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.post("/signup", validate(signupSchema), signupCreator);

/**
 * @swagger
 * /creator/login:
 *   post:
 *     summary: Login creator
 *     tags: [Creator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             emailOrUsername: "john.doe@example.com"
 *             password: "Password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         creator:
 *                           $ref: '#/components/schemas/Creator'
 *                         token:
 *                           type: string
 *                           description: JWT authentication token
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.post("/login", validate(loginSchema), loginCreator);

// Protected routes (require authentication middleware)
/**
 * @swagger
 * /creator/profile:
 *   get:
 *     summary: Get creator profile
 *     tags: [Creator]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Creator'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Creator not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get("/profile", authenticateToken, getCreatorProfile);

/**
 * @swagger
 * /creator/profile:
 *   put:
 *     summary: Update creator profile
 *     tags: [Creator]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *           example:
 *             username: "john_doe_updated"
 *             firstName: "John"
 *             lastName: "Doe"
 *             phone: "+1234567890"
 *             image:
 *               src: "https://example.com/new-profile.jpg"
 *             banner_image:
 *               src: "https://example.com/new-banner.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Creator'
 *       400:
 *         description: Validation error or username already taken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Creator not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.put(
  "/profile",
  authenticateToken,
  validate(updateProfileSchema),
  updateCreatorProfile
);

router.get("/verify/:id", verifyCreator);

router.get("/all", getAllCreatorsController);

export default router;
