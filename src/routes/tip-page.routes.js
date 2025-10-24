import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getTipPageController, updateTipPageController } from "../controllers/tip-page.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tip Page
 *   description: Tip page management endpoints
 */

/**
 * @swagger
 * /tip-page:
 *   get:
 *     summary: Get tip page blocks for authenticated creator
 *     tags: [Tip Page]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tip page blocks retrieved successfully
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
 *         description: Tip page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", authenticateToken, getTipPageController);

/**
 * @swagger
 * /tip-page:
 *   put:
 *     summary: Update tip page blocks for authenticated creator
 *     tags: [Tip Page]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTipPageRequest'
 *     responses:
 *       200:
 *         description: Tip page blocks updated successfully
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
 *         description: Tip page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/", authenticateToken, updateTipPageController);

export default router;
