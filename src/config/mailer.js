const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ subject, html, attachments = [] }) => {
  return await resend.emails.send({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: [process.env.RECEIVER_EMAIL],
    subject,
    html,
    attachments: attachments, // Added this line
  });
};

module.exports = sendMail;