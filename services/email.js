const nodemailer = require("nodemailer");

const EMAIL_USER = process.env.EMAIL_USER; 
const EMAIL_PASS = process.env.EMAIL_PASS; 
const EMAIL_TO = process.env.EMAIL_TO || "test@example.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

async function sendEmail(outcome) {
  let subject, text;

  switch (outcome) {
    case "success":
      subject = "✅ Payment Negotiation Successful";
      text = `Dear Team,

Great news! The customer has accepted the proposed payment amount and the negotiation was successful.

Next steps:
- Please proceed with the necessary follow-up actions.
- Update the records accordingly.

Thank you,
Debt Negotiator Bot`;
      break;
    case "partial":
      subject = "⚠️ Payment Negotiation Partially Successful";
      text = `Dear Team,

The customer did not accept the proposed amount but has agreed to pay the initial amount offered.

Next steps:
- Review the payment details and consider further negotiation if appropriate.
- Update the records to reflect this partial agreement.

Thank you,
Debt Negotiator Bot`;
      break;
    case "failure":
    case "fail":
      subject = "❌ Payment Negotiation Failed";
      text = `Dear Team,

Unfortunately, the customer has canceled the payment and the negotiation was not successful.

Next steps:
- Consider alternative approaches or follow-up with the customer if needed.
- Update the records to reflect this outcome.

Thank you,
Debt Negotiator Bot`;
      break;
    case "neutral":
      subject = "ℹ️ Payment Negotiation Outcome: Neutral";
      text = `Dear Team,

The negotiation with the customer resulted in a neutral outcome. No agreement was reached at this time.

Next steps:
- Review the case and determine if further action is required.
- Update the records as necessary.

Thank you,
Debt Negotiator Bot`;
      break;
    default:
      subject = "ℹ️ Payment Negotiation Update";
      text = `Dear Team,

There is an update regarding a payment negotiation. Please review the system for more details.

Thank you,
Debt Negotiator Bot`;
      break;
  }

  const mailOptions = {
    from: EMAIL_USER,
    to: EMAIL_TO,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📩 Email sent: ${subject}`);
}

module.exports = { sendEmail };
