import mongoose, { Schema } from "mongoose";

const carbonLogSchema = new Schema({
  sourceType: {
    type: String,
    required: true,
    enum: ["Equipment", "Logistics", "Process"],
  },
  sourceId: {
    // Could be an equipmentId or another identifier
    type: String,
    required: true,
    index: true,
  },
  site: {
    type: Schema.Types.ObjectId,
    ref: "Site",
    required: true,
  },
  activityData: {
    // e.g., Liters of diesel, hours of operation
    value: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  co2e: {
    // Calculated Carbon Dioxide Equivalent
    type: Number, // in kg or tonnes
    required: true,
  },
  calculationTimestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export const CarbonLog = mongoose.model("CarbonLog", carbonLogSchema);
