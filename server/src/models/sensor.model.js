import mongoose, { Schema } from "mongoose";

const sensorSchema = new Schema(
  {
    sensorHardwareId: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ["AirQuality", "GasLeak", "Temperature", "Vibration"],
    },
    site: { type: Schema.Types.ObjectId, ref: "Site" },
    locationDescription: { type: String }, // e.g., "Shaft 3, Level 2"
    status: { type: String, enum: ["Active", "Inactive", "Error"], default: "Active" },
  },
  { timestamps: true }
);

export const Sensor = mongoose.model("Sensor", sensorSchema);

// models/sensorReading.model.js

const sensorReadingSchema = new Schema(
  {
    sensor: { type: Schema.Types.ObjectId, ref: "Sensor", required: true, index: true },
    timestamp: { type: Date, default: Date.now, index: true },
    // Using a flexible 'Mixed' type to store different kinds of readings
    // e.g., { co: 5, no2: 1, methane: 0.5 } for AirQuality
    // e.g., { value: 1.2, unit: 'ppm' } for GasLeak
    reading: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    // Capped collection might be useful for high-frequency data
    // capped: { size: 102400000, max: 50000 }
  }
);

export const SensorReading = mongoose.model("SensorReading", sensorReadingSchema);
