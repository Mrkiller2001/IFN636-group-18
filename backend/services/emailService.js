// Example service (Decorator/Adapter could be applied if you add multiple providers)
class EmailService {
  async send(to, subject, body) {
    // plug in nodemailer / SES / Sendgrid here
    console.log(`[EmailService] -> ${to}: ${subject}`);
    return true;
  }
}
module.exports = new EmailService();
