const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ subject, html }) => {
  return await resend.emails.send({
    from: `RX Flow <${process.env.FROM_EMAIL}>`,
    to: [process.env.RECEIVER_EMAIL],
    subject,
    html,
  });
};

module.exports = sendMail;
