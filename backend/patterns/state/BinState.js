
/**
 * State Pattern: BinState
 * -----------------------
 * Purpose: Manages and transitions the state of a Bin object.
 * Usage: new BinState(bin).setState('needs_pickup')
 * Why: Encapsulates state logic and transitions, making code easier to maintain and extend.
 */

class BinState {
  constructor(bin) {
    this.bin = bin;
  }

  setState(state) {
    switch (state) {
      case 'needs_pickup':
        this.bin.status = 'needs_pickup';
        break;
      case 'normal':
        this.bin.status = 'normal';
        this.bin.latestFillPct = 0;
        break;
      case 'out_of_service':
        this.bin.status = 'out_of_service';
        break;
      default:
        throw new Error('Unknown state');
    }
    return this.bin;
  }
}

module.exports = BinState;
