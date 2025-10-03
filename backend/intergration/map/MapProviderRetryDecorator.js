/**
 * Decorator Pattern: MapProviderRetryDecorator
 * --------------------------------------------
 * Purpose: Adds retry logic to map provider calls without modifying the original provider.
 * Usage: new MapProviderRetryDecorator(realProvider, { retries, backoffMs })
 * Why: Extends functionality in a flexible, reusable way.
 */
function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }

class MapProviderRetryDecorator {
  constructor(real, { retries = 2, backoffMs = 300 } = {}) {
    this.real = real; this.retries = retries; this.backoffMs = backoffMs;
  }
  async #withRetry(fn, args) {
    let attempt = 0, err;
    while (attempt <= this.retries) {
      try { return await this.real[fn](...args); }
      catch (e) { err = e; attempt += 1; if (attempt <= this.retries) await wait(this.backoffMs * attempt); }
    }
    throw err;
  }
  geocode(...args){ return this.#withRetry('geocode', args); }
  route(...args){ return this.#withRetry('route', args); }
}
module.exports = MapProviderRetryDecorator;
