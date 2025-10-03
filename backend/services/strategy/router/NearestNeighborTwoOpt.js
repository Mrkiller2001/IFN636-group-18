/**
 * Strategy Pattern: NearestNeighborTwoOpt
 * ---------------------------------------
 * Purpose: Encapsulates routing algorithms, allowing flexible switching of strategies.
 * Usage: new NearestNeighborTwoOpt(distanceStrategy, mapFacade)
 * Why: Enables interchangeable routing logic for different scenarios.
 */
// Simple NN + 2-opt improvement; uses MapFacade when available, else haversine

class NearestNeighborTwoOpt {
  constructor(distanceStrategy, mapFacade) {
    this.distance = distanceStrategy;
    this.map = mapFacade;
  }

  async orderStops(depot, bins) {
    if (!bins.length) return [];

    // nearest neighbor seed
    const unvisited = bins.map(b => ({
      binId: b._id ?? b.binId ?? b.id,
      name: b.name,
      location: b.location
    }));
    const ordered = [];
    let current = depot;

    while (unvisited.length) {
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < unvisited.length; i++) {
        const d = await this._distance(current, unvisited[i].location);
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      }
      const [next] = unvisited.splice(bestIdx, 1);
      ordered.push(next);
      current = next.location;
    }

    // 2-opt pass
    const improved = await this._twoOpt(depot, ordered);
    return improved.map((s, idx) => ({ ...s, order: idx }));
  }

  async routeDistanceKm(depot, orderedStops) {
    if (!orderedStops.length) return 0;

    // try external provider (polyline) – otherwise fallback
    const coords = [depot, ...orderedStops.map(s => s.location)];
    const external = await this.map.totalRouteDistanceKm(coords);
    if (typeof external === 'number' && external >= 0) return external;

    // fallback: segment haversine
    let total = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      total += this.distance.distanceKm(coords[i], coords[i + 1]);
    }
    return Number(total.toFixed(3));
  }

  async _distance(a, b) {
    const external = await this.map.distanceKm(a, b);
    if (typeof external === 'number') return external;
    return this.distance.distanceKm(a, b);
  }

  async _twoOpt(depot, path) {
    const clone = [...path];
    const n = clone.length;
    let improved = true;

    const distAt = async (i, j) => {
      const A = i === -1 ? depot : clone[i].location;
      const B = j === n ? null : j === -1 ? depot : clone[j]?.location;
      if (!B) return 0;
      return this._distance(A, B);
    };

    while (improved) {
      improved = false;
      for (let i = 0; i < n - 1; i++) {
        for (let k = i + 1; k < n; k++) {
          const d1 = (await distAt(i - 1, i)) + (await distAt(k, k + 1));
          const d2 = (await distAt(i - 1, k)) + (await distAt(i, k + 1));
          if (d2 + 1e-9 < d1) {
            // reverse segment i..k
            const seg = clone.slice(i, k + 1).reverse();
            clone.splice(i, seg.length, ...seg);
            improved = true;
          }
        }
      }
    }
    return clone;
  }
}

module.exports = { NearestNeighborTwoOpt };
