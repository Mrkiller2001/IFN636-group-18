/**
 * Singleton Pattern: EventBus
 * ---------------------------
 * Purpose: Ensures only one instance of the event bus exists throughout the app.
 * Usage: require('./EventBus')
 * Why: Centralizes event handling and prevents multiple conflicting event emitters.
 */
const EventEmitter = require('events');
let instance = null;

class EventBus extends EventEmitter {
	constructor() {
		if (instance) return instance;
		super();
		instance = this;
	}
}

module.exports = new EventBus();
