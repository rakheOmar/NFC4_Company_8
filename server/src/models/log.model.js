import mongoose, { Schema } from "mongoose";

const logSchema = new Schema(
  {
    logData: {
      type: Schema.Types.Mixed, // Using Mixed type for flexibility in log structure
      required: true,
    },
    logType: {
      type: String,
      required: true,
      enum: ["System", "Simulation", "Error", "UserAction"], // Example types
    },
    source: {
      type: String,
      required: true,
    },
    blockchainTxHash: {
      type: String,
      default: null, // This will be updated after the blockchain transaction is confirmed
    },
  },
  { timestamps: true }
);

export const Log = mongoose.model("Log", logSchema);