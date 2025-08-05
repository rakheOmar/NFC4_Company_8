import mongoose, { Schema } from "mongoose";

const pointSchema = new Schema({
  /* ... same as in User model ... */
});

const equipmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    equipmentId: { type: String, required: true, unique: true, index: true },
    type: {
      type: String,
      required: true,
      enum: ["Excavator", "Dumper", "Drill", "ConveyorBelt", "VentilationFan"],
    },
    site: { type: Schema.Types.ObjectId, ref: "Site", required: true },
    status: {
      type: String,
      required: true,
      enum: ["Operational", "Idle", "Maintenance", "Offline"],
      default: "Offline",
    },
    currentLocation: { type: pointSchema, index: "2dsphere" },
    operator: { type: Schema.Types.ObjectId, ref: "User" },
    runtimeHours: { type: Number, default: 0 },
    fuelType: { type: String, enum: ["Diesel", "Electric", "Biodiesel"] },
    // Liters per hour for Diesel, kWh for Electric
    consumptionRate: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Equipment = mongoose.model("Equipment", equipmentSchema);
