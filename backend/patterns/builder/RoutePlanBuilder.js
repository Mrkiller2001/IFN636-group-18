
/**
 * Builder Pattern: RoutePlanBuilder
 * ---------------------------------
 * Purpose: Constructs complex RoutePlan objects step-by-step.
 * Usage: new RoutePlanBuilder().setDepot(...).addStop(...).build()
 * Why: Simplifies creation of objects with many parameters and optional parts.
 */

const RoutePlan = require('../../models/RoutePlan');

class RoutePlanBuilder {
  constructor() {
    this.routePlan = {
      depot: null,
      stops: [],
      threshold: 80,
      maxStops: null,
      totalDistanceKm: 0,
      status: 'planned',
      userId: null
    };
  }

  setDepot(lat, lng) {
    this.routePlan.depot = { lat, lng };
    return this;
  }

  addStop(stop) {
    this.routePlan.stops.push(stop);
    return this;
  }

  setThreshold(threshold) {
    this.routePlan.threshold = threshold;
    return this;
  }

  setMaxStops(maxStops) {
    this.routePlan.maxStops = maxStops;
    return this;
  }

  setUserId(userId) {
    this.routePlan.userId = userId;
    return this;
  }

  build() {
    // Return a plain object for test compatibility
    return { ...this.routePlan };
  }
}

module.exports = RoutePlanBuilder;
