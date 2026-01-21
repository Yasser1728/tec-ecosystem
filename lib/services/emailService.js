/**
 * Email Service for TEC Ecosystem
 *
 * Provides centralized email functionality for notifications,
 * alerts, and sovereign control communications.
 *
 * Supports multiple providers: Console (dev), SMTP, SendGrid, AWS SES
 */

/**
 * Email provider configuration
 */
const EMAIL_PROVIDERS = {
  CONSOLE: "console", // Development - logs to console
  SMTP: "smtp", // Standard SMTP
  SENDGRID: "sendgrid", // SendGrid API
  AWS_SES: "aws_ses", // AWS Simple Email Service
};

/**
 * Get configured email provider
 */
function getEmailProvider() {
  const provider = process.env.EMAIL_PROVIDER || EMAIL_PROVIDERS.CONSOLE;
  return provider.toLowerCase();
}

/**
 * Email Service Class
 */
class EmailService {
  constructor() {
    this.provider = getEmailProvider();
    this.from =
      process.env.SMTP_FROM ||
      process.env.EMAIL_FROM ||
      "noreply@tec-ecosystem.com";
    this.configured = this.isConfigured();
  }

  /**
   * Check if email service is properly configured
   */
  isConfigured() {
    switch (this.provider) {
      case EMAIL_PROVIDERS.SMTP:
        return !!(
          process.env.SMTP_HOST &&
          process.env.SMTP_USER &&
          process.env.SMTP_PASSWORD
        );
      case EMAIL_PROVIDERS.SENDGRID:
        return !!process.env.SENDGRID_API_KEY;
      case EMAIL_PROVIDERS.AWS_SES:
        return !!(
          process.env.AWS_ACCESS_KEY_ID &&
          process.env.AWS_SECRET_ACCESS_KEY &&
          process.env.AWS_REGION
        );
      case EMAIL_PROVIDERS.CONSOLE:
      default:
        return true; // Console is always "configured"
    }
  }

  /**
   * Send an email
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email address
   * @param {string} options.subject - Email subject
   * @param {string} options.body - Email body (text)
   * @param {string} [options.html] - Email body (HTML)
   * @param {string} [options.priority] - Email priority (LOW, NORMAL, HIGH, CRITICAL)
   * @returns {Promise<Object>} - Send result
   */
  async send({ to, subject, body, html, priority = "NORMAL" }) {
    if (!to || !subject) {
      throw new Error("Email recipient (to) and subject are required");
    }

    const emailData = {
      from: this.from,
      to,
      subject,
      body,
      html: html || body,
      priority,
      timestamp: new Date().toISOString(),
    };

    try {
      switch (this.provider) {
        case EMAIL_PROVIDERS.SMTP:
          return await this.sendViaSMTP(emailData);
        case EMAIL_PROVIDERS.SENDGRID:
          return await this.sendViaSendGrid(emailData);
        case EMAIL_PROVIDERS.AWS_SES:
          return await this.sendViaAWSSES(emailData);
        case EMAIL_PROVIDERS.CONSOLE:
        default:
          return await this.sendViaConsole(emailData);
      }
    } catch (error) {
      console.error("[EmailService] Send error:", error);

      // Log to console as fallback
      await this.sendViaConsole(emailData);

      return {
        sent: false,
        logged: true,
        error: error.message,
        provider: this.provider,
      };
    }
  }

  /**
   * Send email via console (development/fallback)
   */
  async sendViaConsole(emailData) {
    const separator = "═".repeat(60);

    console.log("\n" + separator);
    console.log("📧 EMAIL SERVICE - CONSOLE OUTPUT");
    console.log(separator);
    console.log(`📬 TO: ${emailData.to}`);
    console.log(`📝 SUBJECT: ${emailData.subject}`);
    console.log(`🔔 PRIORITY: ${emailData.priority}`);
    console.log(`⏰ TIMESTAMP: ${emailData.timestamp}`);
    console.log(separator);
    console.log("📄 BODY:");
    console.log(emailData.body);
    console.log(separator + "\n");

    return {
      sent: false, // Not actually sent
      logged: true,
      provider: EMAIL_PROVIDERS.CONSOLE,
      messageId: `console-${Date.now()}`,
      note: "Email logged to console. Configure EMAIL_PROVIDER for actual sending.",
    };
  }

  /**
   * Send email via SMTP
   */
  async sendViaSMTP(emailData) {
    // Dynamic import to avoid loading nodemailer if not used
    try {
      const nodemailer = await import("nodemailer");

      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.body,
        html: emailData.html,
        priority: emailData.priority === "CRITICAL" ? "high" : "normal",
      });

      return {
        sent: true,
        provider: EMAIL_PROVIDERS.SMTP,
        messageId: info.messageId,
      };
    } catch (error) {
      if (error.code === "ERR_MODULE_NOT_FOUND") {
        console.warn(
          "[EmailService] nodemailer not installed. Run: npm install nodemailer",
        );
        throw new Error(
          "SMTP provider requires nodemailer package. Install with: npm install nodemailer",
        );
      }
      throw error;
    }
  }

  /**
   * Send email via SendGrid
   */
  async sendViaSendGrid(emailData) {
    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey) {
      throw new Error("SENDGRID_API_KEY environment variable not set");
    }

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: emailData.to }] }],
        from: { email: emailData.from },
        subject: emailData.subject,
        content: [
          { type: "text/plain", value: emailData.body },
          { type: "text/html", value: emailData.html },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
    }

    return {
      sent: true,
      provider: EMAIL_PROVIDERS.SENDGRID,
      messageId: response.headers.get("x-message-id"),
    };
  }

  /**
   * Send email via AWS SES (Placeholder)
   *
   * NOTE: This is a placeholder implementation that falls back to console logging.
   * For production use, install and configure @aws-sdk/client-ses:
   * npm install @aws-sdk/client-ses
   *
   * @param {Object} emailData - Email data
   * @returns {Promise<Object>} - Send result (logged to console in placeholder mode)
   */
  async sendViaAWSSES(emailData) {
    const region = process.env.AWS_REGION || "us-east-1";
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error(
        "AWS credentials not configured. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.",
      );
    }

    // Check if AWS SDK is available
    try {
      // Attempt to dynamically import AWS SES client
      const { SESClient, SendEmailCommand } =
        await import("@aws-sdk/client-ses");

      const client = new SESClient({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const command = new SendEmailCommand({
        Source: emailData.from,
        Destination: {
          ToAddresses: [emailData.to],
        },
        Message: {
          Subject: { Data: emailData.subject },
          Body: {
            Text: { Data: emailData.body },
            Html: { Data: emailData.html },
          },
        },
      });

      const response = await client.send(command);

      return {
        sent: true,
        provider: EMAIL_PROVIDERS.AWS_SES,
        messageId: response.MessageId,
      };
    } catch (error) {
      if (error.code === "ERR_MODULE_NOT_FOUND") {
        // AWS SDK not installed - use console fallback
        console.warn(
          "[EmailService] AWS SES: @aws-sdk/client-ses not installed. Falling back to console output.",
        );
        console.warn(
          "[EmailService] To enable AWS SES, run: npm install @aws-sdk/client-ses",
        );

        return await this.sendViaConsole({
          ...emailData,
          note: "AWS SES placeholder mode - install @aws-sdk/client-ses for production.",
        });
      }
      throw error;
    }
  }

  /**
   * Send sovereign notification email
   * High-priority email for critical operations
   */
  async sendSovereignNotification({
    to,
    operationType,
    domain,
    operationData,
    approvalResult,
    user,
  }) {
    const subject = `🚨 TEC Sovereign Alert: ${operationType} in ${domain}`;

    const body = `
TEC Ecosystem - Sovereign Control Notification
${"━".repeat(45)}

🏢 DOMAIN: ${domain.toUpperCase()}
📋 OPERATION: ${operationType}
👤 USER: ${user?.email || user?.id || "Unknown"}
⏰ TIMESTAMP: ${new Date().toISOString()}

💰 TRANSACTION DETAILS:
${JSON.stringify(operationData, null, 2)}

✅ APPROVAL STATUS: ${approvalResult?.approved ? "APPROVED" : "REJECTED"}
📊 RISK LEVEL: ${approvalResult?.riskLevel || "N/A"}
🔐 AUDIT LOG ID: ${approvalResult?.auditLogId || "N/A"}

${approvalResult?.message || ""}

${"━".repeat(45)}
This is an automated sovereign control notification from the TEC Ecosystem.
All operations are logged immutably for forensic audit purposes.
    `.trim();

    return await this.send({
      to,
      subject,
      body,
      priority: "CRITICAL",
    });
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmation({ to, payment }) {
    const subject = `✅ Payment Confirmed - ${payment.amount} ${payment.currency}`;

    const body = `
Your payment has been successfully processed!

Payment Details:
- Amount: ${payment.amount} ${payment.currency}
- Status: ${payment.status}
- Transaction ID: ${payment.piPaymentId || payment.id}
- Date: ${new Date().toISOString()}

Thank you for using TEC Ecosystem.
    `.trim();

    return await this.send({
      to,
      subject,
      body,
      priority: "NORMAL",
    });
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      provider: this.provider,
      configured: this.configured,
      from: this.from,
      available: this.configured,
    };
  }
}

// Singleton instance
const emailService = new EmailService();

export { EmailService, EMAIL_PROVIDERS, emailService };
export default emailService;
