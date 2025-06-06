const env = require("../config/envConfig");
const nodemailer = require("nodemailer");
const sendOTP = require("../utils/template");
const { isEmail } = require("../validator/emailPhoneValidator");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: true, // Enable secure connection
  port: 465, // Use port 465 for secure SMTP
  auth: {
    user: env.MAIL_EMAIL,
    pass: env.MAIL_PASSWORD,
  },
});

// const sendOtp = async (Recipient, otp) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"My App" <${env.MAIL_EMAIL}>`, // Sender's email
//       to: email, // Recipient's email
//       subject: "OTP Verification",
//       html: sendOTP(email, otp), // Use the custom HTML template
//     });
//     console.log("OTP sent successfully to:", email);
//   } catch (error) {
//     console.error("Error sending OTP email to", email, error);
//     throw error;
//   }
// };
const sendOtp = async (recipient, otp, next) => {
  try {
    if (isEmail(recipient)) {
      // Send via email
      const info = await transporter.sendMail({
        from: `"My App" <${env.MAIL_EMAIL}>`,
        to: recipient,
        subject: "OTP Verification",
        html: sendOTP(recipient, otp),
      });
      console.log("OTP sent via email to:", recipient);
    } else {
      //TODO: here implementation of sendOTP using phone number
      // Send via SMS
      // await sendSmsOtp(recipient, otp);
      console.log("OTP sent via SMS to:", recipient);
    }
  } catch (error) {
    console.error("Error sending OTP to", recipient, error);
    next(error);
  }
};

const sendRegLinkForOwener = async (email, token) => {
  const accountCreationUrl = `${env.FRONTEND_URL}/create-account?token=${token}`;
  console.log("FRONTEND_URL: ", accountCreationUrl);
  const info = await transporter.sendMail({
    from: `"Our Official email" <${env.MAIL_EMAIL}>`, // Sender's email
    to: email, // Recipient's email
    subject: "Account Creation Link",
    html: `<p>Click the link below to create your account:</p><a href="${accountCreationUrl}">Create Account</a>`, // Use the custom HTML template
  });
  console.log("Account creation link sent successfully to:", email);
  console.log("Message sent: %s", info.messageId);
  try {
  } catch (error) {
    console.error("Error sending registration link to", email, error);
    next(error);
  }
};

module.exports = { sendOtp, sendRegLinkForOwener };
