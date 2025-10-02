const chai = require('chai');
const { expect } = chai;
const NotificationTemplate = require('../patterns/template/NotificationTemplate');

describe('Template Pattern - NotificationTemplate', () => {
  it('should render a notification message with correct fields', () => {
    const template = new NotificationTemplate();
    const data = {
      userName: 'Isaiah',
      binName: 'Bin1',
      status: 'needs_pickup',
      location: 'Brisbane',
      time: '2025-10-03 10:00'
    };
    const msg = template.render(data);
    expect(msg).to.include('Isaiah');
    expect(msg).to.include('Bin1');
    expect(msg).to.include('needs_pickup');
    expect(msg).to.include('Brisbane');
    expect(msg).to.include('2025-10-03 10:00');
  });
});
