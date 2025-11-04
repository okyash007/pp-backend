import Creator from "../models/creator.js";
import {
  getTips,
  getTipsCount,
  getUnsettledTips,
} from "../services/tip.service.js";
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
    getTipsCount(creator_id, start_date, end_date),
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
    hasPrevPage,
  };

  res.json(
    new ApiResponse(200, { tips, pagination }, "Tips retrieved successfully")
  );
});

// Helper function to escape CSV values
const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  const stringValue = String(value);
  // If value contains comma, newline, or double quote, wrap in quotes and escape quotes
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

// Helper function to convert tips to CSV
const convertTipsToCsv = (tips, razorpayAccountId) => {
  // CSV header
  const headers = [
    "payment_id",
    "account_id",
    "amount",
    "currency",
    "transfer_notes",
    "linked_account_notes",
    "on_hold",
    "on_hold_until"
  ];

  // Create CSV rows
  const rows = tips.map((tip) => {
    // Convert amount to paise (multiply by 100 for INR) and deduct 5%
    const amountInPaise = (tip.amount/100) * 0.95;

    // Create transfer_notes JSON object
    const transferNotes = {
      tip_id: tip.id,
      visitor_id: tip.visitor_id,
      message: tip.message || "",
      created_at: tip.created_at,
    };

    // Get keys from transfer_notes for linked_account_notes
    const linkedAccountNotes = Object.keys(transferNotes);

    // Convert to CSV row
    return [
      escapeCsvValue(tip.payment_id),
      escapeCsvValue(razorpayAccountId),
      escapeCsvValue(amountInPaise),
      escapeCsvValue(tip.currency),
      escapeCsvValue(JSON.stringify(transferNotes)),
      escapeCsvValue(JSON.stringify(linkedAccountNotes)),
      escapeCsvValue("0"),
      escapeCsvValue(""),
    ];
  });

  // Combine header and rows
  const csvLines = [
    headers.join("\t"),
    ...rows.map((row) => row.join("\t")),
  ];

  return csvLines.join("\n");
};

export const getUnsettledTipsController = catchAsync(async (req, res) => {
  const creator_id = req.params.creator_id;
  const creator = await Creator.findOne({ creator_id });

  const razorpayAccountId = creator.razorpay_account_id;

  if (!razorpayAccountId) {
    throw new ApiError(400, "Razorpay account ID is required");
  }

  const tips = await getUnsettledTips(creator_id);

  if (!tips || tips.length === 0) {
    throw new ApiError(400, "No unsettled tips found");
  }

  // Convert tips to CSV
  const csv = convertTipsToCsv(tips, razorpayAccountId);

  // Set headers for CSV download
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="unsettled_tips_${creator_id}_${Date.now()}.csv"`
  );

  res.send(csv);
});
