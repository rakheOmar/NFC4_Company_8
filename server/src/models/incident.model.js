const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: String,
  imageUrl: String,
  location: {
    lat: Number,
    lng: Number
  },
  reportedAt: { type: Date, default: Date.now },
  type: { type: String, enum: ['hazard', 'near-miss', 'injury'], default: 'hazard' },
  resolved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Incident', IncidentSchema);
