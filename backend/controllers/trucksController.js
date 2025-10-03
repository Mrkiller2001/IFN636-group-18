const Truck = require('../models/Truck');

// @desc    Get all trucks
// @route   GET /api/trucks
// @access  Private
const getTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find({}).populate('assignedRoute', 'name');
    res.json(trucks);
  } catch (error) {
    console.error('Error fetching trucks:', error);
    res.status(500).json({ message: 'Server error while fetching trucks' });
  }
};

// @desc    Get single truck
// @route   GET /api/trucks/:id
// @access  Private
const getTruck = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id).populate('assignedRoute');
    
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }
    
    res.json(truck);
  } catch (error) {
    console.error('Error fetching truck:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Truck not found' });
    }
    res.status(500).json({ message: 'Server error while fetching truck' });
  }
};

// @desc    Create new truck
// @route   POST /api/trucks
// @access  Private
const addTruck = async (req, res) => {
  try {
    const {
      name,
      plateNumber,
      licensePlate, // Frontend sends this
      capacity,
      status,
      currentLocationName,
      coordinates,
      driver,
      driverId,
      fuelLevel,
      lastMaintenanceDate,
      currentLocation,
      odometer
    } = req.body;

    // Use licensePlate if plateNumber is not provided (frontend compatibility)
    const plateNum = plateNumber || licensePlate;
    
    if (!plateNum) {
      return res.status(400).json({ message: 'License plate number is required' });
    }

    // Check if truck with this plate number already exists
    const existingTruck = await Truck.findOne({ plateNumber: plateNum.toUpperCase() });
    if (existingTruck) {
      return res.status(400).json({ message: 'Truck with this plate number already exists' });
    }

    // Map frontend status to model status
    const statusMap = {
      'Available': 'Active',
      'On Route': 'In Route',
      'Maintenance': 'Maintenance',
      'Out of Service': 'Out of Service'
    };

    const truckData = {
      name: name || plateNum, // Use plate number as name if no name provided
      plateNumber: plateNum.toUpperCase(),
      capacity: parseInt(capacity) || 1000,
      status: statusMap[status] || 'Active',
      odometer: odometer || 0
    };

    // Handle driver information
    if (driverId) {
      truckData.driver = {
        name: driverId, // For now, use driverId as driver name
        licenseNumber: driverId
      };
    }

    // Set coordinates if provided - handle both formats
    if (currentLocation && currentLocation.coordinates && Array.isArray(currentLocation.coordinates) && currentLocation.coordinates.length === 2) {
      // Frontend format: { address: "...", coordinates: [lng, lat] }
      truckData.currentLocation = {
        type: 'Point',
        coordinates: currentLocation.coordinates
      };
    } else if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      // Direct coordinates format
      truckData.currentLocation = {
        type: 'Point',
        coordinates: coordinates
      };
    }

    const truck = await Truck.create(truckData);
    res.status(201).json(truck);
  } catch (error) {
    console.error('Error creating truck:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Truck with this plate number already exists' });
    }
    
    res.status(500).json({ message: 'Server error while creating truck' });
  }
};

// @desc    Update truck
// @route   PUT /api/trucks/:id
// @access  Private
const updateTruck = async (req, res) => {
  try {
    const {
      name,
      plateNumber,
      capacity,
      status,
      currentLocationName,
      coordinates,
      driver,
      odometer,
      assignedRoute
    } = req.body;

    const truck = await Truck.findById(req.params.id);
    
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }

    // Check if new plate number conflicts with another truck
    if (plateNumber && plateNumber.toUpperCase() !== truck.plateNumber) {
      const existingTruck = await Truck.findOne({ 
        plateNumber: plateNumber.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (existingTruck) {
        return res.status(400).json({ message: 'Truck with this plate number already exists' });
      }
    }

    // Update fields
    if (name !== undefined) truck.name = name;
    if (plateNumber !== undefined) truck.plateNumber = plateNumber.toUpperCase();
    if (capacity !== undefined) truck.capacity = capacity;
    if (status !== undefined) truck.status = status;
    if (currentLocationName !== undefined) truck.currentLocationName = currentLocationName;
    if (driver !== undefined) truck.driver = { ...truck.driver, ...driver };
    if (odometer !== undefined) truck.odometer = odometer;
    if (assignedRoute !== undefined) truck.assignedRoute = assignedRoute;

    // Update coordinates if provided
    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      truck.currentLocation = {
        type: 'Point',
        coordinates: coordinates
      };
    }

    const updatedTruck = await truck.save();
    res.json(updatedTruck);
  } catch (error) {
    console.error('Error updating truck:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Truck not found' });
    }
    
    res.status(500).json({ message: 'Server error while updating truck' });
  }
};

// @desc    Delete truck
// @route   DELETE /api/trucks/:id
// @access  Private
const deleteTruck = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);
    
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }

    await truck.deleteOne();
    res.json({ message: 'Truck removed successfully' });
  } catch (error) {
    console.error('Error deleting truck:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Truck not found' });
    }
    
    res.status(500).json({ message: 'Server error while deleting truck' });
  }
};

// @desc    Get trucks by location/status filters
// @route   GET /api/trucks/filter
// @access  Private
const getTrucksFiltered = async (req, res) => {
  try {
    const { status, location, available } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (location) {
      filter.currentLocationName = new RegExp(location, 'i');
    }

    if (available === 'true') {
      filter.assignedRoute = null;
      filter.status = { $in: ['Active', 'In Route'] };
    }

    const trucks = await Truck.find(filter).populate('assignedRoute', 'name');
    res.json(trucks);
  } catch (error) {
    console.error('Error filtering trucks:', error);
    res.status(500).json({ message: 'Server error while filtering trucks' });
  }
};

module.exports = {
  getTrucks,
  getTruck,
  addTruck,
  updateTruck,
  deleteTruck,
  getTrucksFiltered
};