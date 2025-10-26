import TipPage from "../models/tip-page.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/error.api.js";
import { ApiResponse } from "../utils/response.api.js";

export const getTipPageController = catchAsync(async (req, res) => {
  const creatorId = req.creatorId;
  if (!creatorId) {
    throw new ApiError(400, "Creator ID is required");
  }
  const tipPage = await TipPage.findOne({ creator: creatorId });
  if (!tipPage) {
    throw new ApiError(404, "Tip page not found");
  }
  res.json(new ApiResponse(200, tipPage.blocks));
});

export const updateTipPageController = catchAsync(async (req, res) => {
  const creatorId = req.creatorId;
  if (!creatorId) {
    throw new ApiError(400, "Creator ID is required");
  }
  const tipPage = await TipPage.findOneAndUpdate({ creator: creatorId }, { blocks: req.body.blocks }, { new: true });
  if (!tipPage) {
    throw new ApiError(404, "Tip page not found");
  }
  res.json(new ApiResponse(200, tipPage.blocks));
});