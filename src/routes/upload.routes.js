import express from 'express';
import { uploadImage } from '../controllers/upload.controller.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload an image to Cloudinary
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: number
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       description: Cloudinary image URL
 *                     public_id:
 *                       type: string
 *                     width:
 *                       type: number
 *                     height:
 *                       type: number
 *                     format:
 *                       type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: No file provided or invalid file type
 */
router.post('/image', upload.single('image'), uploadImage);

export default router;
