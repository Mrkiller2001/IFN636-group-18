const Bin = require('../models/Bin');
const RoutePlan = require('../models/RoutePlan');
const { haversineKm } = require('../utils/geo');

// POST /api/routes
// body: { name, depot:{coordinates:[lng,lat], address}, threshold=80, maxStops, assignedTruck, scheduledDate }
const createRoutePlan = async (req, res) => {
  const userId = req.user?.id || req.user?._id?.toString();
  const { name, depot, threshold = 80, maxStops, assignedTruck, scheduledDate } = req.body;

  try {
    console.log('📋 Creating route plan with data:', {
      name,
      depot,
      threshold,
      maxStops,
      assignedTruck,
      scheduledDate
    });

    if (!name) {
      return res.status(400).json({ message: 'Route name is required' });
    }
    
    if (!depot) {
      console.error('❌ No depot provided in request');
      return res.status(400).json({ message: 'Depot information is required' });
    }
    
    if (!depot.coordinates || !Array.isArray(depot.coordinates) || depot.coordinates.length !== 2) {
      console.error('❌ Invalid depot coordinates:', depot.coordinates);
      return res.status(400).json({ message: 'Valid depot coordinates [lng, lat] are required' });
    }

    console.log('✅ Depot coordinates valid:', depot.coordinates);

    // candidate bins
    const bins = await Bin.find({
      userId,
      $or: [
        { status: 'needs_pickup' },
        { latestFillPct: { $gte: threshold } }
      ]
    });

    if (!bins.length) {
      return res.status(400).json({ message: 'No bins require pickup at this time' });
    }

    // Convert depot coordinates for distance calculation
    const [depotLng, depotLat] = depot.coordinates;
    let current = { lat: depotLat, lng: depotLng };

    // greedy nearest-neighbor from depot using GeoJSON coordinates
    const remaining = bins.map(b => {
      const [lng, lat] = b.location.coordinates;
      return {
        binId: b._id,
        name: b.name || b.address,
        location: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        address: b.address,
        // For distance calculation
        lat,
        lng
      };
    });

    const stops = [];
    let total = 0;
    const routeCoordinates = [depot.coordinates]; // Start at depot

    while (remaining.length && (!maxStops || stops.length < maxStops)) {
      // find nearest
      let idx = 0;
      let bestDist = haversineKm(current, { lat: remaining[0].lat, lng: remaining[0].lng });
      for (let i = 1; i < remaining.length; i++) {
        const d = haversineKm(current, { lat: remaining[i].lat, lng: remaining[i].lng });
        if (d < bestDist) {
          bestDist = d;
          idx = i;
        }
      }
      const next = remaining.splice(idx, 1)[0];
      const stop = {
        binId: next.binId,
        name: next.name,
        location: next.location,
        address: next.address,
        distanceFromPrevKm: Number(bestDist.toFixed(3))
      };
      stops.push(stop);
      routeCoordinates.push(next.location.coordinates);
      current = { lat: next.lat, lng: next.lng };
      total += bestDist;
    }

    // Add return to depot
    const returnDistance = haversineKm(current, { lat: depotLat, lng: depotLng });
    total += returnDistance;
    routeCoordinates.push(depot.coordinates);

    // Create route plan directly
    const routePlan = new RoutePlan({
      userId,
      name,
      depot,
      threshold,
      maxStops,
      totalDistanceKm: Number(total.toFixed(3)),
      status: 'planned',
      assignedTruck,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      coordinates: routeCoordinates,
      stops
    });

    await routePlan.save();
    console.log('✅ Route plan created successfully:', routePlan.name);
    res.status(201).json(routePlan);
  } catch (error) {
    console.error('❌ Error creating route plan:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/routes
const listRoutePlans = async (req, res) => {
  const userId = req.user?.id || req.user?._id?.toString();
  try {
    const plans = await RoutePlan.find({ userId }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/routes/:id
const getRoutePlan = async (req, res) => {
  const userId = req.user?.id || req.user?._id?.toString();
  try {
    const plan = await RoutePlan.findOne({ _id: req.params.id, userId });
    if (!plan) return res.status(404).json({ message: 'Route plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/routes/:id
const updateRoutePlan = async (req, res) => {
  const userId = req.user?.id || req.user?._id?.toString();
  const { name, depot, threshold = 80, maxStops, assignedTruck, scheduledDate, status } = req.body;

  try {
    console.log('📝 Updating route plan:', req.params.id, 'with data:', {
      name, depot, threshold, maxStops, assignedTruck, scheduledDate, status
    });

    const existingPlan = await RoutePlan.findOne({ _id: req.params.id, userId });
    if (!existingPlan) {
      return res.status(404).json({ message: 'Route plan not found' });
    }

    // Validate input
    if (!name) {
      return res.status(400).json({ message: 'Route name is required' });
    }

    if (depot && (!depot.coordinates || !Array.isArray(depot.coordinates) || depot.coordinates.length !== 2)) {
      return res.status(400).json({ message: 'Valid depot coordinates [lng, lat] are required' });
    }

    // Update fields
    existingPlan.name = name;
    if (depot) existingPlan.depot = depot;
    if (threshold !== undefined) existingPlan.threshold = threshold;
    if (maxStops !== undefined) existingPlan.maxStops = maxStops;
    if (assignedTruck !== undefined) existingPlan.assignedTruck = assignedTruck;
    if (scheduledDate !== undefined) existingPlan.scheduledDate = scheduledDate ? new Date(scheduledDate) : undefined;
    if (status) existingPlan.status = status;

    await existingPlan.save();
    console.log('✅ Route plan updated successfully');
    res.json(existingPlan);
  } catch (error) {
    console.error('❌ Error updating route plan:', error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/routes/:id
const deleteRoutePlan = async (req, res) => {
  const userId = req.user?.id || req.user?._id?.toString();
  try {
    const plan = await RoutePlan.findOne({ _id: req.params.id, userId });
    if (!plan) return res.status(404).json({ message: 'Route plan not found' });
    await plan.deleteOne();
    res.json({ message: 'Route plan deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRoutePlan, listRoutePlans, getRoutePlan, updateRoutePlan, deleteRoutePlan };
