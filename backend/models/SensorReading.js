const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  binId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin', index: true, required: true },
  fillPct: { type: Number, min: 0, max: 100, required: true },
  batteryPct: { type: Number, min: 0, max: 100 },
  takenAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
