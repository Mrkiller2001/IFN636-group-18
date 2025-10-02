const chai = require('chai');
const { expect } = chai;
const BinState = require('../patterns/state/BinState');

describe('State Pattern - BinState', () => {
  it('should transition bin status correctly', () => {
    const bin = { status: 'normal', latestFillPct: 0 };
    const state = new BinState(bin);
    state.setState('needs_pickup');
    expect(bin.status).to.equal('needs_pickup');
    state.setState('normal');
    expect(bin.status).to.equal('normal');
    expect(bin.latestFillPct).to.equal(0);
    state.setState('out_of_service');
    expect(bin.status).to.equal('out_of_service');
  });
  it('should throw on unknown state', () => {
    const bin = { status: 'normal' };
    const state = new BinState(bin);
    expect(() => state.setState('invalid')).to.throw();
  });
});
