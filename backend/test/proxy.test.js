const chai = require('chai');
const { expect } = chai;
const MapProviderProxy = require('../intergration/map/MapProviderProxy');

describe('Proxy Pattern - MapProviderProxy', () => {
  it('should cache geocode and route results', async () => {
    const real = {
      geocode: async (address) => ({ lat: 1, lng: 2 }),
      route: async (points) => ({ distanceKm: 10 })
    };
    const proxy = new MapProviderProxy(real);
    const geo1 = await proxy.geocode('A');
    const geo2 = await proxy.geocode('A');
    expect(geo1).to.deep.equal(geo2);
    const route1 = await proxy.route([geo1, geo2]);
    const route2 = await proxy.route([geo1, geo2]);
    expect(route1).to.deep.equal(route2);
  });
});
