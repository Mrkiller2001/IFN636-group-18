const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({
  binId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin', required: true },
  name: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  address: String,
  distanceFromPrevKm: { type: Number, default: 0 }
}, { _id: false });

const RoutePlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true }, // Add route name
  depot: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude] 
      required: true
    },
    address: String
  },
  threshold: { type: Number, default: 80 },      // fill% threshold
  maxStops: { type: Number },                    // optional cap on stops
  totalDistanceKm: { type: Number, default: 0 }, // includes return to depot
  status: { type: String, enum: ['planned','active','completed'], default: 'planned' },
  assignedTruck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
  scheduledDate: { type: Date },
  coordinates: [[Number]], // Array of [lng, lat] points for the route path
  stops: [StopSchema],
}, { timestamps: true });

module.exports = mongoose.model('RoutePlan', RoutePlanSchema);
