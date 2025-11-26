import Ticket from "../models/ticket.js";
import { ApiResponse } from "../utils/response.api.js";
import ApiError from "../utils/error.api.js";
import catchAsync from "../utils/catchAsync.js";

// Create a new ticket
export const createTicket = catchAsync(async (req, res) => {
  const creatorId = req.creatorId;
  const { title, description } = req.body;

  const ticket = new Ticket({
    creator: creatorId,
    title,
    description,
    status: "open",
  });

  const savedTicket = await ticket.save();
  await savedTicket.populate("creator", "username email firstName lastName");

  const response = new ApiResponse(
    201,
    savedTicket,
    "Ticket created successfully"
  );

  res.status(201).json(response);
});

// Get all tickets (with optional filters)
export const getAllTickets = catchAsync(async (req, res) => {
  const { status, creator } = req.query;
  const creatorId = req.creatorId;
  const creatorRole = req.creator?.role;

  // Build query
  const query = {};

  // If user is not admin, only show their own tickets
  if (creatorRole !== "admin") {
    query.creator = creatorId;
  } else {
    // Admin can filter by creator
    if (creator) {
      query.creator = creator;
    }
  }

  if (status) {
    query.status = status;
  }

  const tickets = await Ticket.find(query)
    .populate("creator", "username email firstName lastName")
    .sort({ createdAt: -1 });

  const response = new ApiResponse(
    200,
    tickets,
    "Tickets retrieved successfully"
  );

  res.status(200).json(response);
});

// Get a single ticket by ID
export const getTicketById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const creatorId = req.creatorId;
  const creatorRole = req.creator?.role;

  const ticket = await Ticket.findById(id)
    .populate("creator", "username email firstName lastName");

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  // Check if user has permission to view this ticket
  if (creatorRole !== "admin" && ticket.creator._id.toString() !== creatorId.toString()) {
    throw new ApiError(403, "You don't have permission to view this ticket");
  }

  const response = new ApiResponse(
    200,
    ticket,
    "Ticket retrieved successfully"
  );

  res.status(200).json(response);
});

// Update a ticket
export const updateTicket = catchAsync(async (req, res) => {
  const { id } = req.params;
  const creatorId = req.creatorId;
  const creatorRole = req.creator?.role;
  const updateData = req.body;

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  // Check permissions
  if (creatorRole !== "admin" && ticket.creator.toString() !== creatorId.toString()) {
    throw new ApiError(403, "You don't have permission to update this ticket");
  }

  // Only allow updating specific fields
  const allowedFields = ["title", "description", "status", "solution_description"];
  Object.keys(updateData).forEach((key) => {
    if (allowedFields.includes(key) && updateData[key] !== undefined) {
      ticket[key] = updateData[key];
    }
  });

  const updatedTicket = await ticket.save();
  await updatedTicket.populate("creator", "username email firstName lastName");

  const response = new ApiResponse(
    200,
    updatedTicket,
    "Ticket updated successfully"
  );

  res.status(200).json(response);
});

// Delete a ticket
export const deleteTicket = catchAsync(async (req, res) => {
  const { id } = req.params;
  const creatorId = req.creatorId;
  const creatorRole = req.creator?.role;

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  // Check permissions - only admin or ticket creator can delete
  if (creatorRole !== "admin" && ticket.creator.toString() !== creatorId.toString()) {
    throw new ApiError(403, "You don't have permission to delete this ticket");
  }

  await Ticket.findByIdAndDelete(id);

  const response = new ApiResponse(
    200,
    null,
    "Ticket deleted successfully"
  );

  res.status(200).json(response);
});

// Get tickets by creator
export const getTicketsByCreator = catchAsync(async (req, res) => {
  const { creatorId } = req.params;
  const currentUserId = req.creatorId;
  const creatorRole = req.creator?.role;

  // Only admin or the creator themselves can view their tickets
  if (creatorRole !== "admin" && creatorId !== currentUserId.toString()) {
    throw new ApiError(403, "You don't have permission to view these tickets");
  }

  const tickets = await Ticket.find({ creator: creatorId })
    .populate("creator", "username email firstName lastName")
    .sort({ createdAt: -1 });

  const response = new ApiResponse(
    200,
    tickets,
    "Tickets retrieved successfully"
  );

  res.status(200).json(response);
});

