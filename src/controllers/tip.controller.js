import { getTips, getTipsCount } from "../services/tip.service.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/error.api.js";
import { ApiResponse } from "../utils/response.api.js";

export const getTipsController = catchAsync(async (req, res) => {
  const { creator_id } = req.creator;
  const { start_date, end_date, page = 1, limit = 100 } = req.query;

  // Validate pagination parameters
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (pageNum < 1) {
    throw new ApiError(400, "Page number must be greater than 0");
  }

  if (limitNum < 1 || limitNum > 100) {
    throw new ApiError(400, "Limit must be between 1 and 100");
  }

  // Get tips and total count in parallel
  const [tips, totalCount] = await Promise.all([
    getTips(creator_id, start_date, end_date, pageNum, limitNum),
    getTipsCount(creator_id, start_date, end_date)
  ]);

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;

  const pagination = {
    currentPage: pageNum,
    totalPages,
    totalCount,
    limit: limitNum,
    hasNextPage,
    hasPrevPage
  };

  res.json(new ApiResponse(200, { tips, pagination }, "Tips retrieved successfully"));
});