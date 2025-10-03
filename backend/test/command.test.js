const chai = require('chai');
const { expect } = chai;
const BinActionCommand = require('../patterns/command/BinActionCommand');

describe('Command Pattern - BinActionCommand', () => {
  it('should execute pickup, empty, and out_of_service actions', () => {
    const bin = { status: 'normal', latestFillPct: 50 };
    new BinActionCommand('pickup', bin).execute();
    expect(bin.status).to.equal('needs_pickup');
    new BinActionCommand('empty', bin).execute();
    expect(bin.status).to.equal('normal');
    expect(bin.latestFillPct).to.equal(0);
    new BinActionCommand('out_of_service', bin).execute();
    expect(bin.status).to.equal('out_of_service');
  });
  it('should throw on unknown action', () => {
    const bin = { status: 'normal' };
    expect(() => new BinActionCommand('invalid', bin).execute()).to.throw();
  });
});
