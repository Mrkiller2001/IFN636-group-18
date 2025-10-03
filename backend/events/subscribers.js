const bus = require('./EventBus');
const log = require('../services/Logger');

// Example subscriber: log & count
bus.on('bin.needs_pickup', ({ bin }) => {
  log.info('Observer: bin.needs_pickup', { id: bin?._id?.toString(), name: bin?.name, user: bin?.userId?.toString() });
  // Use Template Pattern for notification
  const NotificationTemplate = require('../patterns/template/NotificationTemplate');
  const template = new NotificationTemplate();
  const message = template.render({
    userName: bin?.userId?.toString(),
    binName: bin?.name,
    status: bin?.status,
    location: bin?.location,
    time: new Date().toLocaleString()
  });
  log.info('Notification:', message);
});

bus.on('route.completed', ({ routeId }) => {
  log.info('Observer: route.completed', { routeId: String(routeId) });
});
  
bus.on('bin.status_changed', ({ bin, oldStatus, newStatus }) => {
  log.info('Observer: bin.status_changed', { id: bin?._id?.toString(), oldStatus, newStatus });
});

bus.on('bin.created', ({ bin }) => {
  log.info('Observer: bin.created', { id: bin?._id?.toString(), name: bin?.name });
});

bus.on('route.created', ({ routePlan }) => {
  log.info('Observer: route.created', { id: routePlan?._id?.toString(), stops: routePlan?.stops?.length });
});
