import express from "express";
import { getOverlayController, updateOverlayController } from "../controllers/overlay.controllers.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Overlay
 *   description: Overlay management endpoints
 */

/**
 * @swagger
 * /overlay:
 *   get:
 *     summary: Get overlay blocks for authenticated creator
 *     tags: [Overlay]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overlay blocks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Block'
 *       400:
 *         description: Bad request - Creator ID is required
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
 *         description: Overlay not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", authenticateToken, getOverlayController);

/**
 * @swagger
 * /overlay:
 *   put:
 *     summary: Update overlay blocks for authenticated creator
 *     tags: [Overlay]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOverlayRequest'
 *     responses:
 *       200:
 *         description: Overlay blocks updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Block'
 *       400:
 *         description: Bad request - Creator ID is required or invalid request body
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
 *         description: Overlay not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/", authenticateToken, updateOverlayController);

export default router;
