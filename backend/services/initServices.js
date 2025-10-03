// Facade/Strategy wiring middleware – attaches services to req

const { HaversineDistanceStrategy } = require('./strategy/distance/HaversineDistanceStrategy');
const { NearestNeighborTwoOpt } = require('./strategy/router/NearestNeighborTwoOpt');
const { MapProviderFacade } = require('./providers/MapProviderFacade');
const { RoutePlanner } = require('./routePlanner');

function attachServices(req, _res, next) {
  // distance strategy (default to haversine)
  const distanceStrategy = new HaversineDistanceStrategy();

  // optional external map provider (Adapter/Facade) – fallback to strategy distance if none
  const mapFacade = new MapProviderFacade({
    provider: process.env.MAP_PROVIDER || 'none', // e.g., 'osrm' | 'google' | 'none'
    apiKey: process.env.MAP_API_KEY
  });

  // routing algorithm (Strategy)
  const routingStrategy = new NearestNeighborTwoOpt(distanceStrategy, mapFacade);

  // planner (Facade over strategies)
  const routePlanner = new RoutePlanner({ routingStrategy, distanceStrategy, mapFacade });

  // attach DI
  req.distanceStrategy = distanceStrategy;
  req.mapFacade = mapFacade;
  req.routePlanner = routePlanner;

  next();
}

module.exports = { attachServices };
