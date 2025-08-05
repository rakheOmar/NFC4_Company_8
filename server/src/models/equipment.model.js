const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: String,
  type: String,
  usageHours: Number,
  fuelType: { type: String, enum: ['diesel', 'electric', 'biofuel'] },
  status: { type: String, enum: ['operational', 'maintenance', 'offline'], default: 'operational' },
  carbonFactor: Number // kg CO2 per hour
});

module.exports = mongoose.model('Equipment', EquipmentSchema);
