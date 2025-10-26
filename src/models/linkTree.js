import mongoose from "mongoose";

const linkTreeSchema = new mongoose.Schema(
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

const LinkTree = mongoose.model("link-trees", linkTreeSchema);

export default LinkTree;
