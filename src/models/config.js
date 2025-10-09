import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    colors: {
      primary: {
        type: String,
        default: "#3734eb",
      },
      secondary: {
        type: String,
        default: "#10b981",
      },
      accent: {
        type: String,
        default: "#8b5cf6",
      },
      muted: {
        type: String,
        default: "#f9fafb",
      },
      warning: {
        type: String,
        default: "#f59e0b",
      },
      success: {
        type: String,
        default: "#10b981",
      },
      error: {
        type: String,
        default: "#ef4444",
      },
    },
  },
  { timestamps: true }
);

const Config = mongoose.model("configs", configSchema);

export default Config;
