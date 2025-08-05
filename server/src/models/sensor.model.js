import mongoose, { Schema } from "mongoose";

const pointSchema = new Schema({
  type: { type: String, enum: ["Point"], required: true },
  coordinates: { type: [Number], required: true },
});

const sensorSchema = new Schema(
  {
    sensorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Methane (CH4)",
        "Carbon Monoxide (CO)",
        "Air Quality (PM2.5)",
        "Temperature",
        "Humidity",
      ],
    },
    location: {
      type: pointSchema,
      index: "2dsphere",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Error"],
      default: "Active",
    },
    site: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
  },
  { timestamps: true }
);

export const Sensor = mongoose.model("Sensor", sensorSchema);
