const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { _id: false });

const binSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['general', 'recycle', 'organic'], default: 'general' },
  capacityLitres: { type: Number, min: 1, required: true },
  location: { type: pointSchema, required: true },
  address: { type: String },
  installedAt: { type: Date },
  status: { type: String, enum: ['normal', 'needs_pickup', 'out_of_service'], default: 'normal', index: true },

  // snapshots
  latestFillPct: { type: Number, min: 0, max: 100, default: 0 },
  latestReadingAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Bin', binSchema);
