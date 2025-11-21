import express from "express";
import { textToSpeechController } from "../controllers/tts.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TTS
 *   description: Text-to-Speech endpoints
 */

/**
 * @swagger
 * /tts/speech:
 *   post:
 *     summary: Convert text to speech using OpenAI TTS
 *     tags: [TTS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text to convert to speech
 *                 example: "Today is a wonderful day to build something people love!"
 *               voice:
 *                 type: string
 *                 enum: [alloy, ash, ballad, coral, echo, fable, onyx, nova, shimmer, sage]
 *                 default: coral
 *                 description: The voice to use for speech synthesis
 *               instructions:
 *                 type: string
 *                 description: Instructions for how to speak the text
 *                 example: "Speak in a cheerful and positive tone."
 *     responses:
 *       200:
 *         description: Audio file generated successfully
 *         content:
 *           audio/wav:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Bad request - Missing text or invalid voice
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error - OpenAI API error or configuration issue
 */
router.post("/speech", textToSpeechController);

/**
 * @swagger
 * /tts/speech/public:
 *   post:
 *     summary: Convert text to speech using OpenAI TTS (Public endpoint for overlays)
 *     tags: [TTS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - creator_id
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text to convert to speech
 *                 example: "Today is a wonderful day to build something people love!"
 *               creator_id:
 *                 type: string
 *                 description: Creator ID for validation
 *               voice:
 *                 type: string
 *                 enum: [alloy, ash, ballad, coral, echo, fable, onyx, nova, shimmer, sage]
 *                 default: coral
 *                 description: The voice to use for speech synthesis
 *               instructions:
 *                 type: string
 *                 description: Instructions for how to speak the text
 *                 example: "Speak in a cheerful and positive tone."
 *     responses:
 *       200:
 *         description: Audio file generated successfully
 *         content:
 *           audio/wav:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Bad request - Missing text or invalid voice
 *       500:
 *         description: Server error - OpenAI API error or configuration issue
 */
router.post("/speech/public", textToSpeechController);

export default router;

