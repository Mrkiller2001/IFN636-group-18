const SensorReading = require('../models/SensorReading');
const Bin = require('../models/Bin');

// POST /api/sensor-readings
// Factory function for dependency injection
function makeAddSensorReading(SensorReadingFactory = require('../patterns/factory/SensorReadingFactory')) {
  return async (req, res) => {
    try {
      // 403 if user not authorized
      if (!req.user || !req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      const { binId, fillPct, batteryPct } = req.body;
      const userId = req.user.id;
      // 400 if required fields missing or invalid
      if (!binId || typeof binId !== 'string' || fillPct === undefined || typeof fillPct !== 'number' || isNaN(fillPct)) {
        return res.status(400).json({ message: 'Invalid binId or fillPct' });
      }
      const bin = await Bin.findOne({ _id: binId, userId });
      if (!bin) {
        return res.status(404).json({ message: 'Bin not found' });
      }
      // Use Factory Pattern to create SensorReading instance
      const readingObj = SensorReadingFactory.create({ userId, binId, fillPct, batteryPct });
      const reading = await readingObj.save();
      bin.latestFillPct = fillPct;
      bin.latestBatteryPct = batteryPct;
      if (fillPct >= (bin.pickupThreshold || 80)) {
        bin.status = 'needs_pickup';
      }
      await bin.save();
      res.status(201).json(reading);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

const addSensorReading = makeAddSensorReading();

// GET /api/sensor-readings/bin/:binId
const getReadingsForBin = async (req, res) => {
  const userId = req.user?.id || req.user?._id?.toString();
  const { binId } = req.params;
  try {
    // 403 if user not authorized
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const bin = await Bin.findOne({ _id: binId, userId });
    if (!bin) return res.status(404).json({ message: 'Bin not found' });
    const readings = await SensorReading
      .find({ userId, binId: bin._id })
      .sort({ takenAt: -1 })
      .limit(500);
    res.json(readings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/sensor-readings/:id
const deleteReading = async (req, res) => {
  const userId = req.user?.id || req.user?._id?.toString();

  try {
    const reading = await SensorReading.findOne({ _id: req.params.id, userId });
    if (!reading) return res.status(404).json({ message: 'Reading not found' });

    await reading.deleteOne();
    res.json({ message: 'Reading deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unit-testable versions for direct invocation
const addReading = async (req, res) => {
  try {
    // 403 if user not authorized
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { binId, fillPct, batteryPct, takenAt } = req.body;
    const userId = req.user.id;
    // 400 if required fields missing
    if (!binId || fillPct === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const reading = await SensorReading.create({ userId, binId, fillPct, batteryPct, takenAt });
    const bin = await Bin.findOne({ _id: binId, userId });
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }
    bin.latestFillPct = fillPct;
    bin.latestBatteryPct = batteryPct;
    if (fillPct >= (bin.pickupThreshold || 80)) {
      bin.status = 'needs_pickup';
    }
    await bin.save();
    res.status(201).json(reading);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHistory = async (req, res) => {
  try {
    // 403 if user not authorized
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const userId = req.user.id;
    const { binId } = req.params;
    const readings = await SensorReading.find({ userId, binId }).sort({ takenAt: 1 });
    res.json(readings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addSensorReading, makeAddSensorReading, getReadingsForBin, deleteReading, addReading, getHistory };
