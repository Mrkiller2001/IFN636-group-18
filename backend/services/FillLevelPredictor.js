const EventBus = require('../../events/EventBus');

class FillLevelPredictor {
  constructor({ binModel }) {
    this.binModel = binModel;

  }

  // Base predictFillLevel method (can be overridden)
  async predictFillLevel(bin) {
    // Logic to predict fill level based on historical data
    // This is a placeholder, replace with actual prediction logic
    // In base class, use current fill level as the basis

        const currentFillLevel = bin.latestFillPct || 0;
        const predictedFillLevel = Math.random() * 100; // Example prediction
        if (predictedFillLevel > 90) {
            EventBus.emit('bin.needs_pickup', { bin });
        }
        return predictedFillLevel;
    }
}


class SimpleFillLevelPredictor extends FillLevelPredictor{
        super({binModel});
    }

    async predictFillLevel(bin) {
       const currentFillLevel = bin.latestFillPct || 0;
       const predictedFillLevel = currentFillLevel + 10; // Example: Increase by 10%

       if (predictedFillLevel > 90){
           EventBus.emit('bin.needs_pickup', {bin});
       }

       return predictedFillLevel;
    }
}

class AdvancedFillLevelPredictor extends FillLevelPredictor{
    constructor({binModel}){
        super({binModel});
    }

    async predictFillLevel(bin) {
       //Advanced prediction: Use historical data and machine learning
       //(Placeholder - replace with actual advanced logic)
       const currentFillLevel = bin.latestFillPct || 0;
       const predictedFillLevel = currentFillLevel + Math.random() * 20; // Example

       if (predictedFillLevel > 90){
           EventBus.emit('bin.needs_pickup', {bin});
       }

       return predictedFillLevel;
    }
}

module.exports = {FillLevelPredictor, SimpleFillLevelPredictor, AdvancedFillLevelPredictor};
