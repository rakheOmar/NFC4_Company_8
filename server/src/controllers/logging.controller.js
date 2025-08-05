import { Log } from "../models/log.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { logToBlockchain } from "../utils/blockchain.js";

export const createLog = asyncHandler(async (req, res) => {
  const { logData, logType, source } = req.body;

  if (!logData || !logType || !source) {
    throw new ApiError(400, "logData, logType, and source are required fields.");
  }

  // 1. Create the log entry in the database first
  const newLog = await Log.create({
    logData,
    logType,
    source,
  });

  if (!newLog) {
    throw new ApiError(500, "Failed to create log entry in the database.");
  }

  // 2. Log the entry to the blockchain
  const blockchainTxHash = await logToBlockchain({
    logId: newLog._id.toString(),
    logData: JSON.stringify(logData), // Ensure data is a string for the contract
    logType,
  });

  if (!blockchainTxHash) {
     // Even if blockchain fails, the log is in our DB. We can decide how to handle this.
     // For now, we'll return success but note the blockchain failure.
    console.warn(`Log ${newLog._id} was created but failed to anchor to the blockchain.`);
     return res
    .status(202) // 202 Accepted, as the primary action (DB save) worked but secondary (blockchain) did not.
    .json(new ApiResponse(202, "Log created in DB, but failed to send to blockchain.", newLog));
  }

  // 3. Update the log with the blockchain transaction hash
  newLog.blockchainTxHash = blockchainTxHash;
  await newLog.save();

  res
    .status(201)
    .json(new ApiResponse(201, "Log created and sent to blockchain successfully", newLog));
});

export const getAllLogs = asyncHandler(async (req, res) => {
  const logs = await Log.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, "Logs retrieved successfully", logs));
});

export const getLogByTxHash = asyncHandler(async (req, res) => {
  const { hash } = req.params;
  const log = await Log.findOne({ blockchainTxHash: hash });

  if (!log) {
    throw new ApiError(404, "No log found with the provided transaction hash.");
  }

  res.status(200).json(new ApiResponse(200, "Log retrieved successfully", log));
});
