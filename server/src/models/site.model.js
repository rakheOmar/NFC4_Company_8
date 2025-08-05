import mongoose, { Schema } from "mongoose";

const siteSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    workers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    equipments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Equipment",
      },
    ],
    sensors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sensor",
      },
    ],
  },
  { timestamps: true }
);

siteSchema.index({ location: "2dsphere" });

export const Site = mongoose.model("Site", siteSchema);
