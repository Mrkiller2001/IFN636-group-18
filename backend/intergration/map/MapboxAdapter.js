/**
 * Adapter Pattern: MapboxAdapter
 * ------------------------------
 * Purpose: Adapts the Mapbox API to a standard interface for your app.
 * Usage: new MapboxAdapter(token, http)
 * Why: Allows integration of external APIs with different interfaces.
 */
class MapboxAdapter {
  constructor(token, http) {
    this.token = token;
    this.http = http;
    this.baseGeocode = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
    this.baseRoute = 'https://api.mapbox.com/directions/v5/mapbox/driving';
  }
  async geocode(address) {
    const url = `${this.baseGeocode}/${encodeURIComponent(address)}.json`;
    const { data } = await this.http.get(url, { params: { access_token: this.token, limit: 1, country: 'AU' } });
    const f = data?.features?.[0];
    if (!f?.center) throw new Error('No results');
    return { lat: f.center[1], lng: f.center[0], raw: f };
  }
  async route(points) {
    if (!points || points.length < 2) throw new Error('Need 2+ points');
    const coords = points.map(p => `${p.lng},${p.lat}`).join(';');
    const url = `${this.baseRoute}/${coords}`;
    const { data } = await this.http.get(url, { params: { access_token: this.token, geometries: 'polyline6', overview:'full' } });
    const r = data?.routes?.[0];
    if (!r) throw new Error('No route');
    return { distanceKm: Math.round((r.distance/1000)*100)/100, durationMin: Math.round(r.duration/60), polyline6: r.geometry };
  }
}
module.exports = MapboxAdapter;
