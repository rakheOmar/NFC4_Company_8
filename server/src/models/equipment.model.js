import mongoose, { Schema } from "mongoose";

// Re-using the pointSchema from user.model.js or define it here
const pointSchema = new Schema({
  type: { type: String, enum: ["Point"], required: true },
  coordinates: { type: [Number], required: true },
});

const equipmentSchema = new Schema(
  {
    equipmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Dumper Truck", "Excavator", "Drill", "Loader", "Ventilation Fan"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Idle", "Maintenance", "Offline"],
      default: "Offline",
    },
    currentLocation: {
      type: pointSchema,
      index: "2dsphere",
    },
    operator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fuelType: {
      type: String,
      enum: ["Diesel", "Electric", "Biodiesel"],
      required: true,
    },
    runtimeHours: {
      type: Number,
      default: 0,
    },
    site: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
  },
  { timestamps: true }
);

export const Equipment = mongoose.model("Equipment", equipmentSchema);
