class RoutePlanner {
  constructor({ routingStrategy, distanceStrategy, mapFacade }) {
    this.routing = routingStrategy;
    this.distance = distanceStrategy;
    this.map = mapFacade;
  }

  async plan(depot, bins, { maxStops } = {}) {
    const candidates = Array.isArray(bins) ? [...bins] : [];
    if (maxStops && candidates.length > maxStops) candidates.length = maxStops;

    const order = await this.routing.orderStops(depot, candidates);
    const totalDistanceKm = await this.routing.routeDistanceKm(depot, order);

    return { stops: order, totalDistanceKm };
  }
}

module.exports = { RoutePlanner };
