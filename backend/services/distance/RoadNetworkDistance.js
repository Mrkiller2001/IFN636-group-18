class RoadNetworkDistance {
  constructor(mapProvider) { this.mapProvider = mapProvider; }
  async distanceKm(a, b) {
    const r = await this.mapProvider.route([a, b]);
    return r.distanceKm;
  }
}
module.exports = RoadNetworkDistance;
