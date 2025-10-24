import Overlay from "../models/overlay.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/error.api.js";
import { ApiResponse } from "../utils/response.api.js";

export const getOverlayController = catchAsync(async (req, res) => {
  const creatorId = req.creatorId;
  if (!creatorId) {
    throw new ApiError(400, "Creator ID is required");
  }
  const overlay = await Overlay.findOne({ creator: creatorId });
  if (!overlay) {
    throw new ApiError(404, "Overlay not found");
  }
  res.json(new ApiResponse(200, overlay.blocks));
});

export const updateOverlayController = catchAsync(async (req, res) => {
  const creatorId = req.creatorId;
  if (!creatorId) {
    throw new ApiError(400, "Creator ID is required");
  }
  const overlay = await Overlay.findOneAndUpdate({ creator: creatorId }, { blocks: req.body.blocks }, { new: true });
  if (!overlay) {
    throw new ApiError(404, "Overlay not found");
  }
  res.json(new ApiResponse(200, overlay.blocks));
});