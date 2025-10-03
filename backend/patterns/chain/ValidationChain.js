
/**
 * Chain of Responsibility Pattern: ValidationChain
 * ------------------------------------------------
 * Purpose: Allows multiple validation handlers to process a request in sequence.
 * Usage: new ValidationChain().add(handler).validate(req)
 * Why: Decouples validation logic and enables flexible, reusable validation chains.
 */

class ValidationChain {
  constructor() {
    this.handlers = [];
  }

  add(handler) {
    this.handlers.push(handler);
    return this;
  }

  async validate(req) {
    for (const handler of this.handlers) {
      const result = await handler(req);
      if (result !== true) return result;
    }
    return true;
  }
}

module.exports = ValidationChain;
