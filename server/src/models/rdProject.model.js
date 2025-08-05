import mongoose, { Schema } from "mongoose";

const rdProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    projectCode: {
      type: String,
      unique: true,
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ["Planned", "Ongoing", "Completed", "On-Hold", "Cancelled"],
      default: "Planned",
    },
    startDate: Date,
    endDate: Date,
    budget: {
      type: Number, // In INR
      required: true,
    },
    budgetUtilized: {
      type: Number,
      default: 0,
    },
    outcomes: String,
    lead: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const RDProject = mongoose.model("RDProject", rdProjectSchema);
