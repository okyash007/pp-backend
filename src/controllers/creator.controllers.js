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
import { createSubscription } from "../services/razorpay.service.js";
import { sendEmail } from "../services/email.service.js";

// Generate JWT token
const generateToken = (creatorId) => {
  return jwt.sign({ creatorId }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "7d",
  });
};

// Generate password reset token
const generatePasswordResetToken = (creatorId) => {
  return jwt.sign(
    { creatorId, type: "password_reset" },
    process.env.JWT_SECRET || "fallback_secret",
    {
      expiresIn: "1h", // Token expires in 1 hour
    }
  );
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

  // Create Razorpay subscription
  try {
    // Create subscription using the format from test route
    const subscription = await createSubscription({
      plan_id: process.env.RAZORPAY_PLAN_ID || "plan_RkSauBrurSpcGQ",
      total_count: 12,
      quantity: 1,
      customer_notify: 1,
    });

    // Save subscription_id to creator
    savedCreator.subscription_id = subscription.id;
    await savedCreator.save();
  } catch (error) {
    // Log error but don't fail creator creation
    console.error("Error creating Razorpay subscription for creator:", savedCreator._id, error);
  }

  // Generate token
  const token = generateToken(savedCreator._id);

  // Refresh creator to get updated subscription_id
  const updatedCreator = await Creator.findById(savedCreator._id);

  // Remove sensitive data from response
  const creatorResponse = {
    _id: updatedCreator._id,
    creator_id: updatedCreator.creator_id,
    username: updatedCreator.username,
    firstName: updatedCreator.firstName,
    lastName: updatedCreator.lastName,
    email: updatedCreator.email,
    phone: updatedCreator.phone,
    display_name: updatedCreator.display_name,
    bio: updatedCreator.bio,
    socials: updatedCreator.socials,
    approved: updatedCreator.approved,
    verified: updatedCreator.verified,
    role: updatedCreator.role,
    image: updatedCreator.image,
    banner_image: updatedCreator.banner_image,
    subscription_id: updatedCreator.subscription_id,
    subscription_status: updatedCreator.subscription_status,
    onboarding: updatedCreator.onboarding,
    createdAt: updatedCreator.createdAt,
    updatedAt: updatedCreator.updatedAt,
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
    display_name: creator.display_name,
    bio: creator.bio,
    socials: creator.socials,
    approved: creator.approved,
    verified: creator.verified,
    role: creator.role,
    image: creator.image,
    banner_image: creator.banner_image,
    subscription_id: creator.subscription_id,
    subscription_status: creator.subscription_status,
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
    display_name: creator.display_name,
    bio: creator.bio,
    socials: creator.socials,
    approved: creator.approved,
    verified: creator.verified,
    role: creator.role,
    image: creator.image,
    banner_image: creator.banner_image,
    razorpay_account_id: creator.razorpay_account_id,
    subscription_id: creator.subscription_id,
    subscription_status: creator.subscription_status,
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
      display_name: creator.display_name,
      bio: creator.bio,
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

export const updateCreatorByIdController = catchAsync(async (req, res) => {
  const creatorId = req.params.id;
  const updateData = req.body;
  const updatedCreator = await Creator.findByIdAndUpdate(creatorId, updateData, {
    new: true,
    runValidators: true,
  });
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
    display_name: updatedCreator.display_name,
    bio: updatedCreator.bio,
    socials: updatedCreator.socials,
    approved: updatedCreator.approved,
    verified: updatedCreator.verified,
    role: updatedCreator.role,
    image: updatedCreator.image,
    banner_image: updatedCreator.banner_image,
    onboarding: updatedCreator.onboarding,
    razorpay_account_id: updatedCreator.razorpay_account_id,
    createdAt: updatedCreator.createdAt,
    updatedAt: updatedCreator.updatedAt,
  };
  const response = new ApiResponse(200, creatorResponse, "Creator updated successfully");
  res.status(200).json(response);
});

// Update Creator Password
export const updatePassword = catchAsync(async (req, res) => {
  const creatorId = req.creatorId; // Assuming this is set by auth middleware
  const { newPassword } = req.body;

  // Find creator
  const creator = await Creator.findById(creatorId);
  if (!creator) {
    throw new ApiError(404, "Creator not found");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password
  creator.password = hashedPassword;
  await creator.save();

  const response = new ApiResponse(
    200,
    null,
    "Password updated successfully"
  );
  res.status(200).json(response);
});

// Forgot Password - Send reset email
export const forgotPassword = catchAsync(async (req, res) => {
  const email = decodeURIComponent(req.params.email);

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Find creator by email
  const creator = await Creator.findOne({ email });
  
  // For security, don't reveal if email exists or not
  // Always return success message
  if (!creator) {
    // Still return success to prevent email enumeration
    const response = new ApiResponse(
      200,
      null,
      "If an account with that email exists, a password reset link has been sent"
    );
    return res.status(200).json(response);
  }

  // Generate password reset token
  const resetToken = generatePasswordResetToken(creator._id);

  // Create reset URL
  const resetUrl = `https://dashboard.apextip.space/forgot-password?token=${resetToken}`;

  // Create HTML email template with button matching dashboard theme
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background-color: #AAD6B8;
          padding: 20px;
          line-height: 1.6;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #828BF8 0%, #828BF8 100%);
          border: 5px solid #000000;
          padding: 24px;
          box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 1);
          margin-bottom: 24px;
        }
        .header-title {
          font-size: 28px;
          font-weight: 900;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
          line-height: 1.2;
        }
        .header-title .accent {
          color: #FEF18C;
        }
        .header-subtitle {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 8px;
        }
        .content {
          padding: 30px;
          background-color: #ffffff;
        }
        .greeting {
          font-size: 18px;
          font-weight: 800;
          color: #000000;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: -0.01em;
        }
        .message {
          font-size: 16px;
          color: #000000;
          margin-bottom: 24px;
          font-weight: 500;
          line-height: 1.7;
        }
        .button-wrapper {
          text-align: center;
          margin: 32px 0;
        }
        .button {
          display: inline-block;
          padding: 16px 40px;
          background-color: #000000;
          color: #ffffff;
          text-decoration: none;
          border: 3px solid #000000;
          font-weight: 800;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
          transition: all 0.15s ease;
          cursor: pointer;
        }
        .button:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 1);
        }
        .link-text {
          margin-top: 20px;
          font-size: 14px;
          color: #000000;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .link-url {
          word-break: break-all;
          font-size: 12px;
          color: #828BF8;
          font-weight: 600;
          padding: 12px;
          background-color: #f9f9f9;
          border: 2px solid #000000;
          font-family: monospace;
        }
        .warning {
          margin-top: 32px;
          padding: 20px;
          background-color: #fff3cd;
          border: 3px solid #000000;
          box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
        }
        .warning-title {
          font-size: 14px;
          font-weight: 800;
          color: #000000;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .warning-text {
          font-size: 14px;
          color: #000000;
          font-weight: 500;
          line-height: 1.6;
        }
        .footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 2px solid #000000;
          font-size: 12px;
          color: #666666;
          font-weight: 500;
          text-align: center;
        }
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            width: 100% !important;
          }
          .content {
            padding: 20px !important;
          }
          .header {
            padding: 20px !important;
          }
          .header-title {
            font-size: 24px !important;
          }
          .button {
            padding: 14px 32px;
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <div class="header-title">
            POTATO<span class="accent">PAY</span>
          </div>
          <div class="header-subtitle">
            Password Reset Request
          </div>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello ${creator.firstName || creator.username}!
          </div>
          
          <div class="message">
            We received a request to reset your password. Click the button below to reset your password:
          </div>
          
          <div class="button-wrapper">
            <a href="${resetUrl}" target="_blank" class="button">Reset Password</a>
          </div>
          
          <div class="link-text">Or copy and paste this link into your browser:</div>
          <div class="link-url">${resetUrl}</div>
          
          <div class="warning">
            <div class="warning-title">
              ⚠️ Important
            </div>
            <div class="warning-text">
              This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p style="margin-top: 8px;">© Potato Pay - The Future of Digital Payments & Fun Fan Funding</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send email
  try {
    await sendEmail(creator.email, emailHtml, {
      subject: "Password Reset Request - Potato Pay",
    });

    const response = new ApiResponse(
      200,
      null,
      "If an account with that email exists, a password reset link has been sent"
    );
    res.status(200).json(response);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new ApiError(500, "Failed to send password reset email");
  }
});