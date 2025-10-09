import jwt from "jsonwebtoken";
import Creator from "../models/creator.js";
import ApiError from "../utils/error.api.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      throw new ApiError(401, "Access token required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    const creator = await Creator.findById(decoded.creatorId);

    if (!creator) {
      throw new ApiError(401, "Invalid token - creator not found");
    }

    req.creatorId = creator._id;
    req.creator = creator;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(new ApiError(401, "Invalid token"));
    } else if (error.name === "TokenExpiredError") {
      next(new ApiError(401, "Token expired"));
    } else {
      next(error);
    }
  }
};
