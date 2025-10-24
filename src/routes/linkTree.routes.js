import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getLinkTreeController, updateLinkTreeController } from "../controllers/linkTree.controller.js";

export const router = express.Router();

/**
 * @swagger
 * /api/linktree:
 *   get:
 *     summary: Get link tree blocks for authenticated creator
 *     description: Retrieves the link tree blocks for the currently authenticated creator
 *     tags: [Link Tree]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Link tree blocks retrieved successfully
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
 *                       description: Array of link tree blocks
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
 *         description: Link tree not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", authenticateToken, getLinkTreeController);

/**
 * @swagger
 * /api/linktree:
 *   put:
 *     summary: Update link tree blocks for authenticated creator
 *     description: Updates the link tree blocks for the currently authenticated creator
 *     tags: [Link Tree]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLinkTreeRequest'
 *           example:
 *             blocks:
 *               - type: "creator_card"
 *                 className: "flex flex-col items-center gap-4 p-6"
 *                 template: "<div class=\"border-2 border-black rounded-xl p-4\">Creator Card</div>"
 *               - type: "socails"
 *                 className: "flex gap-2 p-4"
 *                 template: "<div class=\"flex gap-2\">Social Links</div>"
 *     responses:
 *       200:
 *         description: Link tree blocks updated successfully
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
 *                       description: Updated array of link tree blocks
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
 *         description: Link tree not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/", authenticateToken, updateLinkTreeController);

export default router;