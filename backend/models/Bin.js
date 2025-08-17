const mongoose = require('mongoose');

const BinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['general', 'recycle', 'organic'], default: 'general' },
  capacityLitres: { type: Number, min: 1, required: true },
  location: {
    lat: { type: Number, min: -90, max: 90, required: true },
    lng: { type: Number, min: -180, max: 180, required: true }
  },
  status: { type: String, enum: ['normal','needs_pickup','out_of_service'], default: 'normal' },
  latestFillPct: { type: Number, min: 0, max: 100, default: 0 },
  latestReadingAt: { type: Date },
  installedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Bin', BinSchema); // ✅ default export is the model function
