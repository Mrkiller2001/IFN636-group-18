const chai = require('chai');
const { expect } = chai;
const SensorReadingFactory = require('../patterns/factory/SensorReadingFactory');

describe('Factory Pattern - SensorReadingFactory', () => {
  it('should create a SensorReading object with correct fields', () => {
    const data = { userId: 'u1', binId: 'b1', fillPct: 50, batteryPct: 80 };
    const reading = SensorReadingFactory.create(data);
    expect(reading).to.include(data);
    expect(reading.takenAt).to.be.a('date');
  });
});
