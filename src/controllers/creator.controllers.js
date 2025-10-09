import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Creator from "../models/creator.js";
import Config from "../models/config.js";
import { ApiResponse } from "../utils/response.api.js";
import ApiError from "../utils/error.api.js";
import catchAsync from "../utils/catchAsync.js";

// Generate JWT token
const generateToken = (creatorId) => {
  return jwt.sign({ creatorId }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "7d",
  });
};


// Signup Creator
export const signupCreator = catchAsync(async (req, res) => {
  const { username, firstName, lastName, email, password, phone } = req.body;

  // Check if creator already exists by email or username
  const existingCreator = await Creator.findOne({
    $or: [{ email }, { username }]
  });
  if (existingCreator) {
    if (existingCreator.email === email) {
      throw new ApiError(400, "Creator with this email already exists");
    }
    if (existingCreator.username === username) {
      throw new ApiError(400, "Username is already taken");
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Generate verification code (simple 6-digit code)
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Create default config first
  const defaultConfig = new Config({
    colors: {
      primary: "#3734eb",
      secondary: "#10b981",
      accent: "#8b5cf6",
      muted: "#f9fafb",
      warning: "#f59e0b",
      success: "#10b981",
      error: "#ef4444",
    },
  });

  const savedConfig = await defaultConfig.save();

  // Create creator with config reference (creator_id will be auto-generated)
  const creator = new Creator({
    username,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    verificationCode,
    config: savedConfig._id,
  });

  const savedCreator = await creator.save();

  // Generate token
  const token = generateToken(savedCreator._id);

  // Remove sensitive data from response
  const creatorResponse = {
    _id: savedCreator._id,
    creator_id: savedCreator.creator_id,
    username: savedCreator.username,
    firstName: savedCreator.firstName,
    lastName: savedCreator.lastName,
    email: savedCreator.email,
    phone: savedCreator.phone,
    approved: savedCreator.approved,
    config: savedCreator.config,
    image: savedCreator.image,
    banner_image: savedCreator.banner_image,
    createdAt: savedCreator.createdAt,
    updatedAt: savedCreator.updatedAt,
  };

  const response = new ApiResponse(
    201,
    {
      creator: creatorResponse,
      token,
      config: savedConfig,
    },
    "Creator registered successfully"
  );

  res.status(201).json(response);
});

// Login Creator
export const loginCreator = catchAsync(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  // Find creator by email or username and populate config
  const creator = await Creator.findOne({
    $or: [
      { email: emailOrUsername },
      { username: emailOrUsername }
    ]
  }).populate("config");
  
  if (!creator) {
    throw new ApiError(401, "Invalid email/username or password");
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, creator.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email/username or password");
  }

  // Generate token
  const token = generateToken(creator._id);

  // Remove sensitive data from response
  const creatorResponse = {
    _id: creator._id,
    creator_id: creator.creator_id,
    username: creator.username,
    firstName: creator.firstName,
    lastName: creator.lastName,
    email: creator.email,
    phone: creator.phone,
    approved: creator.approved,
    config: creator.config,
    image: creator.image,
    banner_image: creator.banner_image,
    createdAt: creator.createdAt,
    updatedAt: creator.updatedAt,
  };

  const response = new ApiResponse(
    200,
    {
      creator: creatorResponse,
      token,
    },
    "Login successful"
  );

  res.status(200).json(response);
});

// Get Creator Profile
export const getCreatorProfile = catchAsync(async (req, res) => {
  const creatorId = req.creatorId; // Assuming this is set by auth middleware

  const creator = await Creator.findById(creatorId).populate("config");
  if (!creator) {
    throw new ApiError(404, "Creator not found");
  }

  const creatorResponse = {
    _id: creator._id,
    creator_id: creator.creator_id,
    username: creator.username,
    firstName: creator.firstName,
    lastName: creator.lastName,
    email: creator.email,
    phone: creator.phone,
    approved: creator.approved,
    config: creator.config,
    image: creator.image,
    banner_image: creator.banner_image,
    createdAt: creator.createdAt,
    updatedAt: creator.updatedAt,
  };

  const response = new ApiResponse(200, creatorResponse, "Profile retrieved successfully");
  res.status(200).json(response);
});

// Update Creator Profile
export const updateCreatorProfile = catchAsync(async (req, res) => {
  const creatorId = req.creatorId; // Assuming this is set by auth middleware
  const updateData = req.body;

  // Check if username is being updated and if it's already taken
  if (updateData.username) {
    const existingCreator = await Creator.findOne({
      username: updateData.username,
      _id: { $ne: creatorId }
    });
    if (existingCreator) {
      throw new ApiError(400, "Username is already taken");
    }
  }

  // Remove sensitive fields that shouldn't be updated directly
  delete updateData.password;
  delete updateData.verificationCode;
  delete updateData.config;
  delete updateData.creator_id; // creator_id should not be updated

  const creator = await Creator.findByIdAndUpdate(
    creatorId,
    updateData,
    { new: true, runValidators: true }
  ).populate("config");

  if (!creator) {
    throw new ApiError(404, "Creator not found");
  }

  const creatorResponse = {
    _id: creator._id,
    creator_id: creator.creator_id,
    username: creator.username,
    firstName: creator.firstName,
    lastName: creator.lastName,
    email: creator.email,
    phone: creator.phone,
    approved: creator.approved,
    config: creator.config,
    image: creator.image,
    banner_image: creator.banner_image,
    createdAt: creator.createdAt,
    updatedAt: creator.updatedAt,
  };

  const response = new ApiResponse(200, creatorResponse, "Profile updated successfully");
  res.status(200).json(response);
});