import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const creatorSchema = new mongoose.Schema(
  {
    creator_id: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already exists"],
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must be less than 30 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
      trim: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    phone: {
      type: String,
    },
    verificationCode: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    socials: [
      {
        platform: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    subscription_id: {
      type: String,
    },
    subscription_status: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
    image: {
      src: {
        type: String,
      },
    },
    banner_image: {
      src: {
        type: String,
      },
    },
    onboarding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "onboardings",
    },
    role: {
      type: String,
      enum: ["admin", "creator"],
      default: "creator",
    },
    razorpay_account_id: {
      type: String,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to automatically generate short creator_id using UUID
creatorSchema.pre("save", function (next) {
  if (!this.creator_id) {
    // Generate UUID and take first 8 characters for shorter creator_id
    this.creator_id = uuidv4().substring(0, 8);
  }
  next();
});

// Custom error handler for duplicate key errors
creatorSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    let message = "";

    switch (field) {
      case "email":
        message = "Email already exists";
        break;
      case "username":
        message = "Username already exists";
        break;
      case "creator_id":
        message = "Creator ID already exists";
        break;
      default:
        message = `${field} already exists`;
    }

    const customError = new Error(message);
    customError.statusCode = 400;
    customError.isOperational = true;
    next(customError);
  } else {
    next(error);
  }
});

const Creator = mongoose.model("creators", creatorSchema);

export default Creator;
