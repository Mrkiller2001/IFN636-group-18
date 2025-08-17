const SensorReading = require('../models/SensorReading');
const Bin = require('../models/Bin');

// POST /api/sensor-readings
const addSensorReading = async (req, res) => {
  const userId = req.user?.id || req.user?._id?.toString();
  const { binId, fillPct, batteryPct, takenAt } = req.body;

  try {
    if (!binId) return res.status(400).json({ message: 'binId is required' });
    if (typeof fillPct !== 'number') {
      return res.status(400).json({ message: 'fillPct is required and must be a number' });
    }

    const bin = await Bin.findOne({ _id: binId, userId });
    if (!bin) return res.status(404).json({ message: 'Bin not found' });

    const reading = await SensorReading.create({
      userId, binId, fillPct, batteryPct, takenAt
    });

    // update bin snapshot
    bin.latestFillPct = fillPct;
    bin.latestReadingAt = reading.takenAt || new Date();
    bin.status = fillPct >= 80 ? 'needs_pickup' : 'normal';
    await bin.save();

    res.status(201).json(reading);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/sensor-readings/bin/:binId
const getReadingsForBin = async (req, res) => {
  const userId = req.user?.id || req.user?._id?.toString();
  const { binId } = req.params;

  try {
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

module.exports = { addSensorReading, getReadingsForBin, deleteReading };
