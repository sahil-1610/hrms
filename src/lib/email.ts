// lib/email.ts
import nodemailer from "nodemailer";

// Create and configure the transporter.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g. "smtp.gmail.com"
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // SMTP username
    pass: process.env.SMTP_PASS, // SMTP password
  },
});

/**
 * sendEmail
 *
 * A reusable function to send emails using nodemailer.
 *
 * @param options - An object containing email details:
 *   - to: Recipient email address.
 *   - subject: Email subject.
 *   - text: Plain text body (optional).
 *   - html: HTML body (optional).
 *   - from: Sender address (optional, defaults to process.env.SMTP_FROM).
 *
 * @returns A promise that resolves with the result of sending the email.
 */
export async function sendEmail(options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}): Promise<any> {
  const mailOptions = {
    from: options.from || process.env.SMTP_FROM, // e.g. '"Your Company" <no-reply@yourcompany.com>'
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return reject(error);
      }
      console.log("Email sent:", info.response);
      resolve(info);
    });
  });
}
