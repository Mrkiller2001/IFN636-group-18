const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['general', 'recycle', 'organic'], default: 'general' },
  capacityLitres: { type: Number, min: 1, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude] - GeoJSON format
      required: true,
      validate: {
        validator: function(v) {
          return Array.isArray(v) && v.length === 2;
        },
        message: 'Coordinates must be an array of [longitude, latitude]'
      }
    }
  },
  address: { type: String },
  installedAt: { type: Date },
  status: { type: String, enum: ['normal', 'needs_pickup', 'out_of_service'], default: 'normal', index: true },

  // snapshots
  latestFillPct: { type: Number, min: 0, max: 100, default: 0 },
  latestReadingAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Bin', binSchema);
