const chai = require('chai');
const { expect } = chai;
const SensorReadingFactory = require('../patterns/factory/SensorReadingFactory');

describe('Factory Pattern - SensorReadingFactory', () => {
  it('should create a SensorReading object with correct fields', () => {
    const data = {
      userId: '507f1f77bcf86cd799439011',
      binId: '507f1f77bcf86cd799439012',
      fillPct: 50,
      batteryPct: 80
    };
    const reading = SensorReadingFactory.create(data);
    expect(reading.userId.toString()).to.equal(data.userId);
    expect(reading.binId.toString()).to.equal(data.binId);
    expect(reading).to.have.property('fillPct', data.fillPct);
    expect(reading).to.have.property('batteryPct', data.batteryPct);
    expect(reading.takenAt).to.be.a('date');
  });
});
