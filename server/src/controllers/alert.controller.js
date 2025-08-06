import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Alert } from "../models/alert.model.js";
import { User } from "../models/user.model.js";

// @desc    Create a new alert
// @route   POST /api/v1/alerts
// @access  Protected
const createAlert = asyncHandler(async (req, res) => {
  const { recipient, message, type, severity } = req.body;

  if (!recipient || !message) {
    throw new ApiError(400, "Recipient and message are required fields");
  }

  const newAlert = await Alert.create({
    recipient,
    message,
    type,
    severity,
  });

  if (!newAlert) {
    throw new ApiError(500, "Failed to create the alert");
  }

  return res.status(201).json(new ApiResponse(201, "Alert created successfully", newAlert));
});

// @desc    Get all alerts for a specific user
// @route   GET /api/v1/alerts/user/:userId
// @access  Protected
const getAlertsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { isResolved } = req.query; // Optional filter

  if (!userId) {
    throw new ApiError(400, "User ID parameter is required");
  }

  // You can add an access check here to ensure the logged-in user
  // is allowed to view these alerts (e.g., req.user._id.toString() === userId)
  // For this example, we assume the `verifyJWT` middleware handles authentication.

  const query = { recipient: userId };
  if (isResolved !== undefined) {
    query.isResolved = isResolved === "true";
  }

  const alerts = await Alert.find(query).sort({ createdAt: -1 });

  if (!alerts) {
    throw new ApiError(404, "Alerts not found for this user");
  }

  return res.status(200).json(new ApiResponse(200, "Alerts fetched successfully", alerts));
});

// @desc    Mark an alert as resolved
// @route   PATCH /api/v1/alerts/:alertId/resolve
// @access  Protected
const markAlertAsResolved = asyncHandler(async (req, res) => {
  const { alertId } = req.params;

  if (!alertId) {
    throw new ApiError(400, "Alert ID parameter is required");
  }

  const updatedAlert = await Alert.findByIdAndUpdate(
    alertId,
    { $set: { isResolved: true, lastUpdate: Date.now() } },
    { new: true }
  );

  if (!updatedAlert) {
    throw new ApiError(404, "Alert not found");
  }

  return res.status(200).json(new ApiResponse(200, "Alert resolved successfully", updatedAlert));
});

export { createAlert, getAlertsByUserId, markAlertAsResolved };
