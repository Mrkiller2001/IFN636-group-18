const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Truck name is required'],
    trim: true
  },
  plateNumber: {
    type: String,
    required: [true, 'Plate number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [0, 'Capacity must be positive']
  },
  status: {
    type: String,
    enum: ['Active', 'In Route', 'Maintenance', 'Out of Service'],
    default: 'Active'
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  currentLocationName: {
    type: String,
    default: 'BCC Depot'
  },
  driver: {
    name: {
      type: String,
      trim: true
    },
    licenseNumber: {
      type: String,
      trim: true
    }
  },
  lastMaintenance: {
    type: Date,
    default: Date.now
  },
  odometer: {
    type: Number,
    default: 0,
    min: [0, 'Odometer reading must be positive']
  },
  assignedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoutePlan',
    default: null
  }
}, {
  timestamps: true
});

// Index for geospatial queries
truckSchema.index({ currentLocation: '2dsphere' });

// Virtual for formatted capacity
truckSchema.virtual('formattedCapacity').get(function() {
  return `${this.capacity} tons`;
});

// Virtual for formatted odometer
truckSchema.virtual('formattedOdometer').get(function() {
  return `${this.odometer.toLocaleString()}km`;
});

module.exports = mongoose.model('Truck', truckSchema);