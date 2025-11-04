import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Creator from "../models/creator.js";
import Onboarding from "../models/onboarding.js";
import Overlay from "../models/overlay.js";
import TipPage from "../models/tip-page.js";
import LinkTree from "../models/linkTree.js";
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
    $or: [{ email }, { username }],
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
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Create creator (creator_id will be auto-generated)
  const creator = new Creator({
    username,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    verificationCode,
    role: "creator", // Default role
    verified: false, // Default verification status
  });

  const savedCreator = await creator.save();

  // Create onboarding record for the new creator
  const onboarding = new Onboarding({
    creator: savedCreator._id,
    step: 1,
    completed: false,
  });

  const savedOnboarding = await onboarding.save();

  // Link the onboarding record to the creator
  savedCreator.onboarding = savedOnboarding._id;
  await savedCreator.save();

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
    socials: savedCreator.socials,
    approved: savedCreator.approved,
    verified: savedCreator.verified,
    role: savedCreator.role,
    image: savedCreator.image,
    banner_image: savedCreator.banner_image,
    onboarding: savedCreator.onboarding,
    createdAt: savedCreator.createdAt,
    updatedAt: savedCreator.updatedAt,
  };

  const response = new ApiResponse(
    201,
    {
      creator: creatorResponse,
      token,
    },
    "Creator registered successfully"
  );

  res.status(201).json(response);
});

// Login Creator
export const loginCreator = catchAsync(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  console.log(emailOrUsername, password);

  // Find creator by email or username
  const creator = await Creator.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!creator) {
    throw new ApiError(401, "Invalid email/username or password");
  }

  console.log(creator);
  console.log("Password from request:", password);
  console.log("Password from database:", creator.password);

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
    socials: creator.socials,
    approved: creator.approved,
    verified: creator.verified,
    role: creator.role,
    image: creator.image,
    banner_image: creator.banner_image,
    onboarding: creator.onboarding,
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

  const creator = await Creator.findById(creatorId);
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
    socials: creator.socials,
    approved: creator.approved,
    verified: creator.verified,
    role: creator.role,
    image: creator.image,
    banner_image: creator.banner_image,
    razorpay_account_id: creator.razorpay_account_id,
    onboarding: creator.onboarding,
    createdAt: creator.createdAt,
    updatedAt: creator.updatedAt,
  };

  const response = new ApiResponse(
    200,
    creatorResponse,
    "Profile retrieved successfully"
  );
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
      _id: { $ne: creatorId },
    });
    if (existingCreator) {
      throw new ApiError(400, "Username is already taken");
    }
  }

  // Remove sensitive fields that shouldn't be updated directly
  delete updateData.password;
  delete updateData.verificationCode;
  delete updateData.creator_id; // creator_id should not be updated

  console.log(updateData);

  const creator = await Creator.findByIdAndUpdate(creatorId, updateData, {
    new: true,
    runValidators: true,
  });

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
    socials: creator.socials,
    approved: creator.approved,
    verified: creator.verified,
    role: creator.role,
    image: creator.image,
    banner_image: creator.banner_image,
    razorpay_account_id: creator.razorpay_account_id,
    onboarding: creator.onboarding,
    createdAt: creator.createdAt,
    updatedAt: creator.updatedAt,
  };

  const response = new ApiResponse(
    200,
    creatorResponse,
    "Profile updated successfully"
  );
  res.status(200).json(response);
});

export const updateCreatorByIDController = catchAsync(async (req, res) => {
  const creatorId = req.params.id;
  const updateData = req.body;
  const updatedCreator = await Creator.findByIdAndUpdate(
    creatorId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedCreator) {
    throw new ApiError(404, "Creator not found");
  }
  const creatorResponse = {
    _id: updatedCreator._id,
    creator_id: updatedCreator.creator_id,
    username: updatedCreator.username,
    firstName: updatedCreator.firstName,
    lastName: updatedCreator.lastName,
    email: updatedCreator.email,
    phone: updatedCreator.phone,
    socials: updatedCreator.socials,
    approved: updatedCreator.approved,
    verified: updatedCreator.verified,
    role: updatedCreator.role,
    image: updatedCreator.image,
    banner_image: updatedCreator.banner_image,
    razorpay_account_id: updatedCreator.razorpay_account_id,
    onboarding: updatedCreator.onboarding,
    createdAt: updatedCreator.createdAt,
    updatedAt: updatedCreator.updatedAt,
  };
  const response = new ApiResponse(
    200,
    creatorResponse,
    "Creator updated successfully"
  );
  res.status(200).json(response);
});

export const verifyCreator = catchAsync(async (req, res) => {
  const creatorId = req.params.id;

  if (!creatorId) {
    throw new ApiError(400, "Creator ID is required");
  }

  const creator = await Creator.findById(creatorId);
  if (!creator) {
    throw new ApiError(404, "Creator not found");
  }

  if (creator.approved) {
    throw new ApiError(400, "Creator already approved");
  }

  // Start a MongoDB session
  const session = await mongoose.startSession();

  try {
    // Start transaction
    await session.startTransaction();

    // Find the creator
    const creator = await Creator.findById(creatorId).session(session);
    if (!creator) {
      throw new ApiError(404, "Creator not found");
    }

    // Update creator as approved
    creator.approved = true;
    await creator.save({ session });

    // Create overlay for the creator
    const overlay = new Overlay({
      creator: creatorId,
      blocks: [], // Empty blocks array initially
    });
    await overlay.save({ session });

    // Create tip-page for the creator (with default blocks from schema)
    const tipPage = new TipPage({
      creator: creatorId,
      // blocks will use the default value from schema
    });
    await tipPage.save({ session });

    // Create link-tree for the creator
    const linkTree = new LinkTree({
      creator: creatorId,
      blocks: [], // Empty blocks array initially
    });
    await linkTree.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    // Prepare response
    const creatorResponse = {
      _id: creator._id,
      creator_id: creator.creator_id,
      username: creator.username,
      firstName: creator.firstName,
      lastName: creator.lastName,
      email: creator.email,
      phone: creator.phone,
      socials: creator.socials,
      approved: creator.approved,
      verified: creator.verified,
      role: creator.role,
      image: creator.image,
      banner_image: creator.banner_image,
      onboarding: creator.onboarding,
      createdAt: creator.createdAt,
      updatedAt: creator.updatedAt,
    };

    const response = new ApiResponse(
      200,
      {
        creator: creatorResponse,
        overlay: {
          _id: overlay._id,
          creator: overlay.creator,
          blocks: overlay.blocks,
          createdAt: overlay.createdAt,
          updatedAt: overlay.updatedAt,
        },
        tipPage: {
          _id: tipPage._id,
          creator: tipPage.creator,
          blocks: tipPage.blocks,
          createdAt: tipPage.createdAt,
          updatedAt: tipPage.updatedAt,
        },
        linkTree: {
          _id: linkTree._id,
          creator: linkTree.creator,
          blocks: linkTree.blocks,
          createdAt: linkTree.createdAt,
          updatedAt: linkTree.updatedAt,
        },
      },
      "Creator verified successfully and overlay, tip-page, and link-tree created"
    );

    res.status(200).json(response);
  } catch (error) {
    // If an error occurred, abort the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    await session.endSession();
  }
});

export const getAllCreatorsController = catchAsync(async (req, res) => {
  const creators = await Creator.find()
    .select("-password -verificationCode -createdAt -updatedAt")
    .populate("onboarding");
  const response = new ApiResponse(
    200,
    creators,
    "Creators fetched successfully"
  );
  res.status(200).json(response);
});
