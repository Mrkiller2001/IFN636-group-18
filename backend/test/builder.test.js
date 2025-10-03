const chai = require('chai');
const { expect } = chai;
const RoutePlanBuilder = require('../patterns/builder/RoutePlanBuilder');

describe('Builder Pattern - RoutePlanBuilder', () => {
  it('should build a RoutePlan object with correct fields', () => {
    const userId = '507f1f77bcf86cd799439011';
    const builder = new RoutePlanBuilder()
      .setDepot(1, 2)
      .setThreshold(90)
      .setMaxStops(5)
      .setUserId(userId)
      .addStop({ binId: 'b1', name: 'Bin1', location: { lat: 1, lng: 2 } });
    const plan = builder.build().toObject();
    expect(plan.depot).to.deep.equal({ 
      type: 'Point', 
      coordinates: [2, 1] // GeoJSON format: [lng, lat]
    });
    expect(plan.threshold).to.equal(90);
    expect(plan.maxStops).to.equal(5);
    expect(plan.userId.toString()).to.equal(userId);
    expect(plan.stops).to.have.lengthOf(1);
  });
});
