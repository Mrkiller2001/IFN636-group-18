const mongoose = require('mongoose');

const SensorReadingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  binId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin', required: true, index: true },
  fillPct: { type: Number, required: true, min: 0, max: 100 },
  batteryPct: { type: Number, min: 0, max: 100 },
  takenAt: { type: Date, default: Date.now }
}, { timestamps: true });

SensorReadingSchema.index({ binId: 1, takenAt: -1 });

module.exports = mongoose.model('SensorReading', SensorReadingSchema);
