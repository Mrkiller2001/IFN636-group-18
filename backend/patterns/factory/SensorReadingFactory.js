
/**
 * Factory Pattern: SensorReadingFactory
 * -------------------------------------
 * Purpose: Encapsulates the creation of SensorReading objects.
 * Usage: SensorReadingFactory.create({ userId, binId, fillPct, batteryPct })
 * Why: Centralizes object creation logic, making it easier to change instantiation details.
 */

const SensorReading = require('../../models/SensorReading');

class SensorReadingFactory {
  static create({ userId, binId, fillPct, batteryPct, takenAt }) {
    return new SensorReading({
      userId,
      binId,
      fillPct,
      batteryPct,
      takenAt: takenAt ? new Date(takenAt) : new Date()
    });
  }
}

module.exports = SensorReadingFactory;
