import mongoose, { Schema } from "mongoose";

const pointSchema = new Schema({
  /* ... same as in User model ... */
});

const incidentSchema = new Schema(
  {
    site: { type: Schema.Types.ObjectId, ref: "Site", required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "PPE_VIOLATION", // AI Detected
        "DANGER_ZONE_ENTRY", // AI Detected
        "EQUIPMENT_MALFUNCTION", // Worker/AI Reported
        "HAZARD_REPORT", // Worker Reported
        "NEAR_MISS", // Worker Reported
        "ENVIRONMENTAL_SPILL",
      ],
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Reported", "Investigating", "Resolved"],
      default: "Reported",
    },
    description: { type: String, required: true },
    location: { type: pointSchema },
    reportedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Can be null if AI-generated
    involvedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    involvedEquipment: { type: Schema.Types.ObjectId, ref: "Equipment" },
    mediaUrls: [String], // URLs to images or video clips from worker or CCTV
    resolutionNotes: { type: String },
  },
  { timestamps: true }
);

export const Incident = mongoose.model("Incident", incidentSchema);
