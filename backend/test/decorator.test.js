const chai = require('chai');
const { expect } = chai;
const MapProviderRetryDecorator = require('../intergration/map/MapProviderRetryDecorator');

describe('Decorator Pattern - MapProviderRetryDecorator', () => {
  it('should retry failed calls up to the limit', async () => {
    let callCount = 0;
    const real = {
      geocode: async () => { callCount++; if (callCount < 2) throw new Error('fail'); return 'ok'; },
      route: async () => 'route-ok'
    };
    const decorator = new MapProviderRetryDecorator(real, { retries: 2, backoffMs: 1 });
    const result = await decorator.geocode('A');
    expect(result).to.equal('ok');
    expect(callCount).to.equal(2);
    const routeResult = await decorator.route([]);
    expect(routeResult).to.equal('route-ok');
  });
});
