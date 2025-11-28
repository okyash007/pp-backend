import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creators",
      required: false, // null means notification is for all creators
      default: null,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title must be less than 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["info", "warning", "success", "error"],
      default: "info",
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creators",
      required: [true, "Sender is required"],
    },
  },
  { timestamps: true }
);

// Index for efficient queries
notificationSchema.index({ creator: 1, read: 1 });
notificationSchema.index({ creator: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });

const Notification = mongoose.model("notifications", notificationSchema);

export default Notification;

