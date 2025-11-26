import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialization of email transporter
let transporter = null;

/**
 * Get or initialize email transporter
 * @returns {Object} Nodemailer transporter instance
 * @throws {Error} If email configuration is not set up
 */
const getEmailTransporter = () => {
  if (!transporter) {
    // Support for SMTP configuration
    const smtpConfig = {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true" || false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    // If SMTP credentials are not provided, throw an error
    if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
      throw new Error(
        "Email configuration is not set up. Please set SMTP_USER and SMTP_PASSWORD environment variables."
      );
    }

    transporter = nodemailer.createTransport(smtpConfig);
  }

  return transporter;
};

/**
 * Send an email with HTML content
 * @param {string} to - Recipient email address
 * @param {string} html - HTML content of the email
 * @param {Object} options - Additional email options
 * @param {string} options.subject - Email subject (default: "No Subject")
 * @param {string} options.from - Sender email address (default: SMTP_USER)
 * @param {string} options.text - Plain text version of the email (optional)
 * @param {Array<string>} options.cc - CC recipients (optional)
 * @param {Array<string>} options.bcc - BCC recipients (optional)
 * @param {Array<Object>} options.attachments - Email attachments (optional)
 * @returns {Promise<Object>} Email sending result
 * @throws {Error} If email sending fails
 */
export const sendEmail = async (to, html, options = {}) => {
  try {
    // Validate required parameters
    if (!to) {
      throw new Error("Recipient email address is required");
    }

    if (!html) {
      throw new Error("HTML content is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error("Invalid recipient email address format");
    }

    // Get email transporter
    const emailTransporter = getEmailTransporter();

    // Prepare email options
    const mailOptions = {
      from: options.from || process.env.SMTP_USER || process.env.SMTP_FROM,
      to: to,
      subject: options.subject || "No Subject",
      html: html,
      text: options.text || undefined, // Plain text fallback
      cc: options.cc || undefined,
      bcc: options.bcc || undefined,
      attachments: options.attachments || undefined,
    };

    // Validate from email if provided
    if (mailOptions.from && !emailRegex.test(mailOptions.from)) {
      throw new Error("Invalid sender email address format");
    }

    // Send email
    const info = await emailTransporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(
      error.message || "Failed to send email"
    );
  }
};

/**
 * Verify email transporter configuration
 * @returns {Promise<boolean>} True if configuration is valid
 */
export const verifyEmailConfig = async () => {
  try {
    const emailTransporter = getEmailTransporter();
    await emailTransporter.verify();
    return true;
  } catch (error) {
    console.error("Email configuration verification failed:", error);
    return false;
  }
};

export default sendEmail;

