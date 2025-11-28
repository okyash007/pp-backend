import express from "express";
import {
  createNotification,
  getMyNotifications,
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notification.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management endpoints
 */

// All notification routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /notification:
 *   post:
 *     summary: Create a new notification (admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [info, warning, success, error]
 *               creatorId:
 *                 type: string
 *                 description: Optional - if provided, send to specific creator. If not, send to all creators.
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin only
 */
router.post("/", createNotification);

/**
 * @swagger
 * /notification/my:
 *   get:
 *     summary: Get all notifications for the current creator
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: read
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/my", getMyNotifications);

/**
 * @swagger
 * /notification/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/unread-count", getUnreadCount);

/**
 * @swagger
 * /notification/all:
 *   get:
 *     summary: Get all notifications (admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: creator
 *         schema:
 *           type: string
 *         description: Filter by creator ID
 *       - in: query
 *         name: read
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin only
 */
router.get("/all", getAllNotifications);

/**
 * @swagger
 * /notification/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 *       403:
 *         description: Forbidden - insufficient permissions
 *       401:
 *         description: Unauthorized
 */
router.patch("/:id/read", markAsRead);

/**
 * @swagger
 * /notification/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 */
router.patch("/read-all", markAllAsRead);

/**
 * @swagger
 * /notification/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 *       403:
 *         description: Forbidden - insufficient permissions
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", deleteNotification);

export default router;

