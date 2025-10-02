const chai = require('chai');
const { expect } = chai;
const RoutePlanBuilder = require('../patterns/builder/RoutePlanBuilder');

describe('Builder Pattern - RoutePlanBuilder', () => {
  it('should build a RoutePlan object with correct fields', () => {
    const builder = new RoutePlanBuilder()
      .setDepot(1, 2)
      .setThreshold(90)
      .setMaxStops(5)
      .setUserId('u1')
      .addStop({ binId: 'b1', name: 'Bin1', location: { lat: 1, lng: 2 } });
    const plan = builder.build();
    expect(plan.depot).to.deep.equal({ lat: 1, lng: 2 });
    expect(plan.threshold).to.equal(90);
    expect(plan.maxStops).to.equal(5);
    expect(plan.userId).to.equal('u1');
    expect(plan.stops).to.have.lengthOf(1);
  });
});
