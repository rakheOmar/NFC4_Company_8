import mongoose, { Schema } from "mongoose";

const rdProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    projectCode: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Planning", "In-Progress", "Completed", "On-Hold", "Cancelled"],
      default: "Planning",
    },
    startDate: { type: Date },
    expectedCompletionDate: { type: Date },
    actualCompletionDate: { type: Date },
    budget: { type: Number, required: true }, // in INR
    budgetUtilization: { type: Number, default: 0 },
    projectLead: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teamMembers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    outcomesAndFindings: { type: String },
  },
  { timestamps: true }
);

export const RDProject = mongoose.model("RDProject", rdProjectSchema);
