import Onboarding from "../models/onboarding.js";
import { ApiResponse } from "../utils/response.api.js";
import ApiError from "../utils/error.api.js";
import catchAsync from "../utils/catchAsync.js";

export const getOnboardingController = catchAsync(async (req, res) => {
  let onboarding = await Onboarding.findOne({ creator: req.creatorId });
  
  // If no onboarding exists, create a new one for the user
  if (!onboarding) {
    onboarding = await Onboarding.create({
      creator: req.creatorId,
      step: 1,
      completed: false
    });
  }
  
  const response = new ApiResponse(
    200,
    onboarding,
    "Onboarding retrieved successfully"
  );
  res.status(200).json(response);
});

export const updateOnboardingController = catchAsync(async (req, res) => {
  let onboarding = await Onboarding.findOneAndUpdate(
    { creator: req.creatorId },
    req.body,
    { new: true, upsert: true }
  );
  
  // If no onboarding exists, create a new one with the provided data
  if (!onboarding) {
    onboarding = await Onboarding.create({
      creator: req.creatorId,
      ...req.body
    });
  }
  
  const response = new ApiResponse(
    200,
    onboarding,
    "Onboarding updated successfully"
  );
  res.status(200).json(response);
});
