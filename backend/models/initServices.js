const TrafficService = require('./TrafficService');
const FillLevelPredictor = require('../integration/map/FillLevelPredictor');

function buildServices() {
  // ... (existing code)

  const trafficService = new TrafficService(mapProvider);
  const fillLevelPredictor = new FillLevelPredictor(Bin);

  return { mapProvider, distanceStrategy, routePlanner, trafficService, fillLevelPredictor };
}

function attachServices(req, _res, next) {
  if (!req.services) req.services = {};

  // ... (existing code)

  // Traffic Service
  req.services.trafficService = new TrafficService(req.services.mapProvider);

  // Fill Level Predictor
  req.services.fillLevelPredictor = new FillLevelPredictor(Bin);

  next();
}

module.exports = { buildServices, attachServices };
