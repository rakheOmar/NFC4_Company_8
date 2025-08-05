import mongoose, { Schema } from "mongoose";

const siteSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    locationName: {
      type: String, // e.g., "Jharia, Jharkhand"
      required: true,
    },
    geoBoundary: {
      // For mapping the entire site area
      type: {
        type: String,
        enum: ["Polygon"],
      },
      coordinates: {
        type: [[[Number]]], // Array of arrays of [longitude, latitude]
      },
    },
    supervisors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Site = mongoose.model("Site", siteSchema);
