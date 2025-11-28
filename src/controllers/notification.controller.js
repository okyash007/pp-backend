import mongoose from "mongoose";
const { Types } = mongoose;
import Notification from "../models/notification.js";
import Creator from "../models/creator.js";
import { ApiResponse } from "../utils/response.api.js";
import ApiError from "../utils/error.api.js";
import catchAsync from "../utils/catchAsync.js";

// Create a new notification (admin only)
export const createNotification = catchAsync(async (req, res) => {
  const senderId = req.creatorId;
  const creatorRole = req.creator?.role;
  const { title, message, type, creatorId } = req.body;

  // Only admin can create notifications
  if (creatorRole !== "admin") {
    throw new ApiError(403, "Only admins can create notifications");
  }

  // Validate required fields
  if (!title || !message) {
    throw new ApiError(400, "Title and message are required");
  }

  // If creatorId is provided, send to specific creator
  if (creatorId) {
    const creator = await Creator.findById(creatorId);
    if (!creator) {
      throw new ApiError(404, "Creator not found");
    }

    const notification = new Notification({
      creator: creatorId,
      title,
      message,
      type: type || "info",
      sentBy: senderId,
    });

    const savedNotification = await notification.save();
    await savedNotification.populate("creator", "username email firstName lastName");
    await savedNotification.populate("sentBy", "username email firstName lastName");

    const response = new ApiResponse(
      201,
      savedNotification,
      "Notification sent successfully"
    );

    return res.status(201).json(response);
  }

  // If no creatorId, send to all creators
  const allCreators = await Creator.find({ role: "creator" });
  
  if (allCreators.length === 0) {
    throw new ApiError(400, "No creators found to send notification to");
  }

  console.log(`Sending notification to ${allCreators.length} creators`);

  const notifications = [];

  for (const creator of allCreators) {
    const notification = new Notification({
      creator: creator._id,
      title,
      message,
      type: type || "info",
      sentBy: senderId,
    });
    notifications.push(notification);
  }

  const savedNotifications = await Notification.insertMany(notifications);
  console.log(`Created ${savedNotifications.length} notifications`);
  
  // Populate the first notification for response if there are any
  if (savedNotifications.length > 0) {
    await savedNotifications[0].populate("creator", "username email firstName lastName");
    await savedNotifications[0].populate("sentBy", "username email firstName lastName");
  }

  const response = new ApiResponse(
    201,
    {
      notifications: savedNotifications,
      count: savedNotifications.length,
      message: `Notification sent to ${savedNotifications.length} creators`,
    },
    "Notifications sent successfully"
  );

  res.status(201).json(response);
});

// Get all notifications for the current creator
export const getMyNotifications = catchAsync(async (req, res) => {
  const creatorId = req.creatorId;
  const { read, limit = 50 } = req.query;

  // Ensure creatorId is properly formatted as ObjectId
  let creatorObjectId;
  try {
    creatorObjectId = Types.ObjectId.isValid(creatorId)
      ? new Types.ObjectId(creatorId)
      : creatorId;
  } catch (error) {
    creatorObjectId = creatorId; // Fallback to original if conversion fails
  }

  const query = { creator: creatorObjectId };

  if (read !== undefined) {
    query.read = read === "true";
  }

  const notifications = await Notification.find(query)
    .populate("sentBy", "username email firstName lastName")
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  console.log("Found notifications:", notifications.length);

  const unreadCount = await Notification.countDocuments({
    creator: creatorObjectId,
    read: false,
  });

  console.log("Unread count:", unreadCount);

  const response = new ApiResponse(
    200,
    {
      notifications,
      unreadCount,
    },
    "Notifications retrieved successfully"
  );

  res.status(200).json(response);
});

// Get all notifications (admin only)
export const getAllNotifications = catchAsync(async (req, res) => {
  const creatorRole = req.creator?.role;
  const { creator, read, limit = 100 } = req.query;

  // Only admin can view all notifications
  if (creatorRole !== "admin") {
    throw new ApiError(403, "Only admins can view all notifications");
  }

  const query = {};

  if (creator) {
    query.creator = creator;
  }

  if (read !== undefined) {
    query.read = read === "true";
  }

  const notifications = await Notification.find(query)
    .populate("creator", "username email firstName lastName")
    .populate("sentBy", "username email firstName lastName")
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  const response = new ApiResponse(
    200,
    notifications,
    "Notifications retrieved successfully"
  );

  res.status(200).json(response);
});

// Mark notification as read
export const markAsRead = catchAsync(async (req, res) => {
  const { id } = req.params;
  const creatorId = req.creatorId;

  const notification = await Notification.findById(id);

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  // Check if user has permission to mark this notification as read
  if (notification.creator && notification.creator.toString() !== creatorId.toString()) {
    throw new ApiError(403, "You don't have permission to mark this notification as read");
  }

  notification.read = true;
  notification.readAt = new Date();
  await notification.save();

  const response = new ApiResponse(
    200,
    notification,
    "Notification marked as read"
  );

  res.status(200).json(response);
});

// Mark all notifications as read
export const markAllAsRead = catchAsync(async (req, res) => {
  const creatorId = req.creatorId;

  // Ensure creatorId is properly formatted as ObjectId
  let creatorObjectId;
  try {
    creatorObjectId = Types.ObjectId.isValid(creatorId)
      ? new Types.ObjectId(creatorId)
      : creatorId;
  } catch (error) {
    creatorObjectId = creatorId; // Fallback to original if conversion fails
  }

  const result = await Notification.updateMany(
    { creator: creatorObjectId, read: false },
    { read: true, readAt: new Date() }
  );

  const response = new ApiResponse(
    200,
    { updatedCount: result.modifiedCount },
    "All notifications marked as read"
  );

  res.status(200).json(response);
});

// Delete a notification
export const deleteNotification = catchAsync(async (req, res) => {
  const { id } = req.params;
  const creatorId = req.creatorId;
  const creatorRole = req.creator?.role;

  const notification = await Notification.findById(id);

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  // Check permissions - only admin or notification recipient can delete
  if (creatorRole !== "admin" && notification.creator && notification.creator.toString() !== creatorId.toString()) {
    throw new ApiError(403, "You don't have permission to delete this notification");
  }

  await Notification.findByIdAndDelete(id);

  const response = new ApiResponse(
    200,
    null,
    "Notification deleted successfully"
  );

  res.status(200).json(response);
});

// Get unread count
export const getUnreadCount = catchAsync(async (req, res) => {
  const creatorId = req.creatorId;

  // Ensure creatorId is properly formatted as ObjectId
  let creatorObjectId;
  try {
    creatorObjectId = Types.ObjectId.isValid(creatorId)
      ? new Types.ObjectId(creatorId)
      : creatorId;
  } catch (error) {
    creatorObjectId = creatorId; // Fallback to original if conversion fails
  }

  const unreadCount = await Notification.countDocuments({
    creator: creatorObjectId,
    read: false,
  });

  const response = new ApiResponse(
    200,
    { unreadCount },
    "Unread count retrieved successfully"
  );

  res.status(200).json(response);
});

