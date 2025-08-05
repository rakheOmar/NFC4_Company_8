const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  department: String,
  budget: Number,
  spent: Number,
  status: { type: String, enum: ["planned", "in-progress", "completed"], default: "planned" },
  startDate: Date,
  endDate: Date,
  outcomes: String,
});

module.exports = mongoose.model("Project", ProjectSchema);
