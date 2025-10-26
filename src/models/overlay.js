import mongoose from "mongoose";

const overlaySchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creators",
    },
    blocks: {
      type: [mongoose.Schema.Types.Mixed],
    },
  },
  { timestamps: true }
);

const Overlay = mongoose.model("overlays", overlaySchema);

export default Overlay;
