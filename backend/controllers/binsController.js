const Bin = require('../models/Bin');

// GET /api/bins
const getBins = async (req, res) => {
  try {
    // 403 if user not authorized
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { type, status } = req.query;
    const filter = { userId: req.user.id };
    if (type) filter.type = type;
    if (status) filter.status = status;
    const bins = await Bin.find(filter).sort({ createdAt: -1 });
    res.json(bins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/bins
const addBin = async (req, res) => {
  try {
    // 403 if user not authorized
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { name, location, template, ...otherFields } = req.body;
    const userId = req.user.id;
    // 400 if required fields missing
    if (!name || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    let payload;
    if (template) {
      payload = cloneBinTemplate(template, { userId, name, location, ...otherFields });
    } else {
      payload = {
        userId,
        name,
        location,
        ...otherFields,
        status: 'normal',
        latestFillPct: 0
      };
    }
    let bin = await Bin.create(payload);
    // Command Pattern for bin actions
    const BinActionCommand = require('../patterns/command/BinActionCommand');
    // Example: set bin status using Command pattern after creation
    const action = req.body.action; // e.g., 'pickup', 'empty', 'out_of_service'
    if (action) {
      const command = new BinActionCommand(action, bin);
      bin = command.execute();
      // Use State pattern for bin status transitions
      const BinState = require('../patterns/state/BinState');
      const state = new BinState(bin);
      bin = state.setState(bin.status);
      await bin.save();
    }
    res.status(201).json(bin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/bins/:id
const getBin = async (req, res) => {
  try {
    const bin = await Bin.findOne({ _id: req.params.id, userId: req.user.id });
    if (!bin) return res.status(404).json({ message: 'Bin not found' });
    res.json(bin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/bins/:id
const updateBin = async (req, res) => {
  const { name, type, capacityLitres, location, status, installedAt } = req.body;
  try {
    const bin = await Bin.findOne({ _id: req.params.id, userId: req.user.id });
    if (!bin) return res.status(404).json({ message: 'Bin not found' });

    bin.name = name || bin.name;
    bin.type = type || bin.type;
    bin.capacityLitres = capacityLitres ?? bin.capacityLitres;
    bin.location = location || bin.location;
    bin.status = status || bin.status;
    bin.installedAt = installedAt || bin.installedAt;

    const updated = await bin.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/bins/:id
const deleteBin = async (req, res) => {
  try {
    const bin = await Bin.findOne({ _id: req.params.id, userId: req.user.id });
    if (!bin) return res.status(404).json({ message: 'Bin not found' });
    await bin.deleteOne();
    res.json({ message: 'Bin deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bins/latest
const getBinsLatest = async (req, res) => {
  try {
    const bins = await Bin.find(
      { userId: req.user.id },
      { name: 1, type: 1, status: 1, latestFillPct: 1, latestReadingAt: 1, location: 1 }
    ).sort({ updatedAt: -1 });
    res.json(bins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBins, addBin, getBin, updateBin, deleteBin, getBinsLatest };
