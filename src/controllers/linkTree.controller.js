import LinkTree from "../models/linkTree.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/error.api.js";
import { ApiResponse } from "../utils/response.api.js";


export const getLinkTreeController = catchAsync(async (req, res) => {
  const creatorId = req.creatorId;
  if (!creatorId) {
    throw new ApiError(400, "Creator ID is required");
  }
  const linkTree = await LinkTree.findOne({ creator: creatorId });
  if (!linkTree) {
    throw new ApiError(404, "Link tree not found");
  }
  res.json(new ApiResponse(200, linkTree.blocks));
});

export const updateLinkTreeController = catchAsync(async (req, res) => {
  const creatorId = req.creatorId;
  if (!creatorId) {
    throw new ApiError(400, "Creator ID is required");
  }
  const linkTree = await LinkTree.findOneAndUpdate({ creator: creatorId }, { blocks: req.body.blocks }, { new: true });
  if (!linkTree) {
    throw new ApiError(404, "Link tree not found");
  }
  res.json(new ApiResponse(200, linkTree.blocks));
});