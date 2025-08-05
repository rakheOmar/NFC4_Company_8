import mongoose, { Schema } from "mongoose";

const sensorReadingSchema = new Schema({
  sensor: {
    type: Schema.Types.ObjectId,
    ref: "Sensor",
    required: true,
    index: true,
  },
  value: {
    type: Number,
    required: true,
  },
  unit: {
    type: String, // e.g., 'ppm', 'celsius', 'µg/m³'
    required: true,
  },
  timestamp: {
    // The time of the reading
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
});

// Compound index for efficient queries
sensorReadingSchema.index({ sensor: 1, timestamp: -1 });

export const SensorReading = mongoose.model("SensorReading", sensorReadingSchema);
