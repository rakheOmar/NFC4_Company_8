const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
  name: String,
  assignedZone: String,
  ppe: [String],
  inDangerZone: Boolean,
  lastKnownLocation: {
    lat: Number,
    lng: Number
  },
  lastChecked: Date
});

module.exports = mongoose.model('Worker', WorkerSchema);
