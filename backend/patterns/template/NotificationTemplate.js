
/**
 * Template Pattern: NotificationTemplate
 * --------------------------------------
 * Purpose: Provides a template for generating notification messages.
 * Usage: new NotificationTemplate().render(data)
 * Why: Standardizes message formatting and makes it easy to change templates.
 */

class NotificationTemplate {
  render(data) {
    return `
      Hello ${data.userName},
      Bin '${data.binName}' requires attention.
      Status: ${data.status}
      Location: ${data.location}
      Time: ${data.time}
    `;
  }
}

module.exports = NotificationTemplate;
