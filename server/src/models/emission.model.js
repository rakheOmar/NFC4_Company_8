const mongoose = require('mongoose');

const EmissionSchema = new mongoose.Schema({
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
  date: Date,
  usageHours: Number,
  calculatedCO2: Number // kg
});

module.exports = mongoose.model('Emission', EmissionSchema);
