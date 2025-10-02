
/**
 * Command Pattern: BinActionCommand
 * ---------------------------------
 * Purpose: Encapsulates bin actions (pickup, empty, out_of_service) as command objects.
 * Usage: new BinActionCommand(action, bin).execute()
 * Why: Decouples action invocation from implementation, enabling flexible command handling.
 */

class BinActionCommand {
  constructor(action, bin) {
    this.action = action;
    this.bin = bin;
  }

  execute() {
    switch (this.action) {
      case 'pickup':
        this.bin.status = 'needs_pickup';
        break;
      case 'empty':
        this.bin.latestFillPct = 0;
        this.bin.status = 'normal';
        break;
      case 'out_of_service':
        this.bin.status = 'out_of_service';
        break;
      default:
        throw new Error('Unknown action');
    }
    return this.bin;
  }
}

module.exports = BinActionCommand;
