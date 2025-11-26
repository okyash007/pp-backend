import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creators",
      required: [true, "Creator is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title must be less than 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    solution_description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
ticketSchema.index({ creator: 1, status: 1 });
ticketSchema.index({ status: 1 });

const Ticket = mongoose.model("tickets", ticketSchema);

export default Ticket;

