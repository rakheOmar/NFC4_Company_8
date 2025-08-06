import mongoose, { Schema } from "mongoose";

const alertSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User", // This links the alert to a specific user
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["safety", "maintenance", "info"],
      default: "info",
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    lastUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Alert = mongoose.model("Alert", alertSchema);
