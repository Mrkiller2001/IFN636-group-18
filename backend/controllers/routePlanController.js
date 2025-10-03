const Bin = require('../models/Bin');
const RoutePlan = require('../models/RoutePlan');
const { haversineKm } = require('../utils/geo');

// POST /api/routes
// body: { depot:{lat,lng}, threshold=80, maxStops }
const createRoutePlan = async (req, res) => {
  const userId = req.user?.id || req.user?._id?.toString();
  const { depot, threshold = 80, maxStops } = req.body;

  try {
    if (!depot || typeof depot.lat !== 'number' || typeof depot.lng !== 'number') {
      return res.status(400).json({ message: 'Valid depot {lat,lng} is required' });
    }

      // Use Builder Pattern to construct RoutePlan
      const RoutePlanBuilder = require('../patterns/builder/RoutePlanBuilder');
      const builder = new RoutePlanBuilder()
        .setDepot(depot.lat, depot.lng)
 .setThreshold(threshold)
 .setMaxStops(maxStops)
        .setUserId(userId);

      let current = { lat: depot.lat, lng: depot.lng };
      // let stops = []; // Removed duplicate declaration

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

    // greedy nearest-neighbor from depot
    const remaining = bins.map(b => ({
      binId: b._id,
      name: b.name,
      location: { lat: b.location.lat, lng: b.location.lng }
    }));

    const stops = [];
    let total = 0;

    while (remaining.length && (!maxStops || stops.length < maxStops)) {
      // find nearest
      let idx = 0;
      let best = haversineKm(current, remaining[0].location);
      let bestDist = best;
      for (let i = 1; i < remaining.length; i++) {
        const d = haversineKm(current, remaining[i].location);
        if (d < bestDist) {
          bestDist = d;
          idx = i;
        }
      }
      const next = remaining.splice(idx, 1)[0];
      const stop = { ...next, distanceFromPrevKm: Number(bestDist.toFixed(3)) };
      builder.addStop(stop);
      stops.push(stop);
      current = next.location;
      total += bestDist;
    }
      const routePlan = await builder.build().save();
    res.status(201).json(routePlan);
  } catch (error) {
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

module.exports = { createRoutePlan, listRoutePlans, getRoutePlan, deleteRoutePlan };
