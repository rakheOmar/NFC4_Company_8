import mongoose, { Schema } from "mongoose";

const pointSchema = new Schema({
  type: { type: String, enum: ["Point"], required: true },
  coordinates: { type: [Number], required: true },
});

const safetyIncidentSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "Near-Miss",
        "Hazard Report",
        "Accident",
        "PPE Violation",
        "Zone Intrusion",
        "Gas Alert",
      ],
    },
    reportedBy: {
      // Can be a user or 'System' for AI alerts
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    location: {
      type: pointSchema,
      required: true,
      index: "2dsphere",
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High", "Critical"],
    },
    status: {
      type: String,
      enum: ["Reported", "Acknowledged", "Investigating", "Resolved"],
      default: "Reported",
    },
    site: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
  },
  { timestamps: true }
);

export const SafetyIncident = mongoose.model("SafetyIncident", safetyIncidentSchema);
