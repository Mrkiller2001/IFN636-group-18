/**
 * Facade Pattern: MapProviderFacade
 * ---------------------------------
 * Purpose: Provides a unified interface to multiple map providers and APIs.
 * Usage: new MapProviderFacade({ provider, apiKey })
 * Why: Simplifies complex subsystem interactions for the rest of the app.
 */
// Facade + Adapter: unify distance calls, optionally talk to OSRM/Google/etc.
// Default: no external provider -> returns null so strategies fallback to haversine.

class MapProviderFacade {
  constructor({ provider = 'none', apiKey } = {}) {
    this.provider = provider;
    this.apiKey = apiKey;
  }

  async distanceKm(a, b) {
    if (this.provider === 'none') return null;
    // TODO: implement adapters for 'osrm', 'google' if keys set
    return null;
  }

  async totalRouteDistanceKm(coords) {
    if (this.provider === 'none') return null;
    // TODO: call provider route API with polyline coordinates
    return null;
  }
}

module.exports = { MapProviderFacade };
