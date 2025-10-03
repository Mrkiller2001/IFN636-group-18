/**
 * Proxy Pattern: MapProviderProxy
 * -------------------------------
 * Purpose: Adds caching to map provider calls, controlling access to the real provider.
 * Usage: new MapProviderProxy(realProvider)
 * Why: Improves performance and controls access transparently.
 */
class MapProviderProxy {
  constructor(real) {
    this.real = real;
    this.cache = new Map();
  }
  #key(name, arg) { return `${name}:${JSON.stringify(arg)}`; }
  async geocode(address) {
    const k = this.#key('geocode', address);
    if (this.cache.has(k)) return this.cache.get(k);
    const res = await this.real.geocode(address);
    this.cache.set(k, res);
    return res;
  }
  async route(points) {
    const k = this.#key('route', points);
    if (this.cache.has(k)) return this.cache.get(k);
    const res = await this.real.route(points);
    this.cache.set(k, res);
    return res;
  }
}
module.exports = MapProviderProxy;
