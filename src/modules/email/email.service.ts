import nodemailer from 'nodemailer';
import { MAIL_USERNAME, NODE_ENV, CLIENT_URL, MAIL_PASSWORD } from '@/config';
import { logger } from '../../utils/logger';
import { Message } from './email.interfaces';

class EmailService {
  private transport = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 587,
    auth: {
      user: MAIL_USERNAME,
      pass: MAIL_PASSWORD,
    },
  });

  constructor() {
    if (NODE_ENV !== 'test') {
      this.transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
    }
  }

  private getEmailTemplate(content: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Niptrex</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f8fafc;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 40px;
            text-align: center;
          }
          .logo {
            color: #ffffff;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .tagline {
            color: #e2e8f0;
            font-size: 14px;
          }
          .content {
            padding: 40px;
          }
          .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 20px;
          }
          .message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.7;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
          }
          .info-box {
            background-color: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
          }
          .info-title {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
          }
          .info-text {
            color: #4a5568;
            font-size: 14px;
          }
          .footer {
            background-color: #f7fafc;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer-text {
            color: #718096;
            font-size: 14px;
            margin-bottom: 10px;
          }
          .footer-link {
            color: #667eea;
            text-decoration: none;
          }
          .divider {
            height: 1px;
            background-color: #e2e8f0;
            margin: 30px 0;
          }
          @media (max-width: 600px) {
            .container {
              margin: 0 10px;
            }
            .content, .header, .footer {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Niptrex</div>
            <div class="tagline">Your trusted platform</div>
          </div>
          ${content}
          <div class="footer">
            <div class="footer-text">
              This email was sent from <a href="https://niptrex.com" class="footer-link">niptrex.com</a>
            </div>
            <div class="footer-text">
              If you have any questions, please don't hesitate to contact our support team.
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  public async sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {
    const msg: Message = {
   from: `"Niptrex" <no-reply@niptrex.com>`,
      to,
      subject,
      text,
      html,
    };
    await this.transport.sendMail(msg);
  }

  public async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const subject = 'Reset Your Password - Niptrex';
    const resetPasswordUrl = `https://niptrex.com/reset-password?token=${token}`;
    const text = `Hi,
    
To reset your password, click on this link: ${resetPasswordUrl}

If you did not request any password resets, then ignore this email.`;

    const content = `
      <div class="content">
        <div class="greeting">Password Reset Request</div>
        <div class="message">
          We received a request to reset your password. Click the button below to create a new password:
        </div>
        <div style="text-align: center;">
          <a href="${resetPasswordUrl}" class="cta-button">Reset Password</a>
        </div>
        <div class="info-box">
          <div class="info-title">Security Notice</div>
          <div class="info-text">
            If you did not request this password reset, please ignore this email. Your password will remain unchanged.
            This link will expire in 24 hours for security purposes.
          </div>
        </div>
      </div>
    `;

    const html = this.getEmailTemplate(content);
    await this.sendEmail(to, subject, text, html);
  }

  public async sendVerificationEmail(to: string, token: string, name: string): Promise<void> {
    const subject = 'Verify Your Email - Niptrex';
    const verificationEmailUrl = `https://niptrex.com/auth/verify-email?token=${token}`;
    const text = `Hi ${name},

To verify your email, click on this link: ${verificationEmailUrl}

If you did not create an account, then ignore this email.`;

    const content = `
      <div class="content">
        <div class="greeting">Hi ${name}! 👋</div>
        <div class="message">
          Welcome to Niptrex! We're excited to have you on board. To complete your registration, 
          please verify your email address by clicking the button below:
        </div>
        <div style="text-align: center;">
          <a href="${verificationEmailUrl}" class="cta-button">Verify Email Address</a>
        </div>
        <div class="info-box">
          <div class="info-title">Need Help?</div>
          <div class="info-text">
            If you did not create an account with Niptrex, please ignore this email.
            If you're having trouble with the button above, copy and paste this link into your browser: ${verificationEmailUrl}
          </div>
        </div>
      </div>
    `;

    const html = this.getEmailTemplate(content);
    await this.sendEmail(to, subject, text, html);
  }

  public async sendMilestoneReviewEmail(to: string, payload: any, name: string): Promise<void> {
    const subject = 'Milestone Ready for Review - Niptrex';
    const text = `Hi ${name},

Milestone: ${payload.milestoneDescription}
is ready for review`;

    const content = `
      <div class="content">
        <div class="greeting">Hi ${name}! 🎯</div>
        <div class="message">
          Great news! A milestone is ready for your review.
        </div>
        <div class="info-box">
          <div class="info-title">Milestone Details</div>
          <div class="info-text">
            <strong>Description:</strong> ${payload.milestoneDescription}
          </div>
        </div>
        <div style="text-align: center;">
          <a href="https://niptrex.com/dashboard" class="cta-button">Review Milestone</a>
        </div>
        <div class="message">
          Please log in to your dashboard to review and approve this milestone.
        </div>
      </div>
    `;

    const html = this.getEmailTemplate(content);
    await this.sendEmail(to, subject, text, html);
  }

  public async sendOutrightReviewEmail(to: string, payload: any, name: string): Promise<void> {
    const subject = 'Proposal Ready for Review - Niptrex';
    const text = `Hi ${name},

Proposal with: ${payload.proposalType}
is ready for review`;

    const content = `
      <div class="content">
        <div class="greeting">Hi ${name}! 📋</div>
        <div class="message">
          A new proposal is ready for your review and consideration.
        </div>
        <div class="info-box">
          <div class="info-title">Proposal Details</div>
          <div class="info-text">
            <strong>Type:</strong> ${payload.proposalType}
          </div>
        </div>
        <div style="text-align: center;">
          <a href="https://niptrex.com/dashboard" class="cta-button">Review Proposal</a>
        </div>
        <div class="message">
          Please review the proposal details in your dashboard and take appropriate action.
        </div>
      </div>
    `;

    const html = this.getEmailTemplate(content);
    await this.sendEmail(to, subject, text, html);
  }

  public async sendServiceReviewEmail(to: string, payload: any, name: string): Promise<void> {
    const subject = 'Service Ready for Review - Niptrex';
    const text = `Hi ${name},

Service with: ${payload.serviceName}
is ready for review`;

    const content = `
      <div class="content">
        <div class="greeting">Hi ${name}! 🔧</div>
        <div class="message">
          A service is ready for your review and approval.
        </div>
        <div class="info-box">
          <div class="info-title">Service Details</div>
          <div class="info-text">
            <strong>Service Name:</strong> ${payload.serviceName}
          </div>
        </div>
        <div style="text-align: center;">
          <a href="https://niptrex.com/dashboard" class="cta-button">Review Service</a>
        </div>
        <div class="message">
          Please check your dashboard to review the service details and provide your feedback.
        </div>
      </div>
    `;

    const html = this.getEmailTemplate(content);
    await this.sendEmail(to, subject, text, html);
  }

  public async sendPaymentConfirmationEmail(to: string, payload: any, name: string): Promise<void> {
    const subject = 'Payment Confirmation - Niptrex';
    const text = `Hi ${name},

Payment for Proposal: ${payload.proposalId}
with job: ${payload.jobTitle} was made`;

    const content = `
      <div class="content">
        <div class="greeting">Hi ${name}! ✅</div>
        <div class="message">
          Great news! Your payment has been successfully processed.
        </div>
        <div class="info-box">
          <div class="info-title">Payment Details</div>
          <div class="info-text">
            <strong>Proposal ID:</strong> ${payload.proposalId}<br>
            <strong>Job Title:</strong> ${payload.jobTitle}<br>
            <strong>Status:</strong> <span style="color: #48bb78; font-weight: 600;">Completed</span>
          </div>
        </div>
        <div style="text-align: center;">
          <a href="https://niptrex.com/dashboard" class="cta-button">View Transaction</a>
        </div>
        <div class="message">
          You can view the full transaction details in your dashboard.
        </div>
      </div>
    `;

    const html = this.getEmailTemplate(content);
    await this.sendEmail(to, subject, text, html);
  }

  public async sendPhotographyPaymentConfirmationEmail(to: string, payload: any, name: string): Promise<void> {
    const subject = 'Photography Payment Confirmation - Niptrex';
    const text = `Hi ${name},

Payment for Photography: ${payload.photographyTitle} was made`;

    const imageUrl = payload.imageUrl;
    const content = `
      <div class="content">
        <div class="greeting">Hi ${name}! 📸</div>
        <div class="message">
          Your photography payment has been successfully processed! Your images are now ready for download.
        </div>
        <div class="info-box">
          <div class="info-title">Photography Details</div>
          <div class="info-text">
            <strong>Title:</strong> ${payload.photographyTitle}<br>
            <strong>Status:</strong> <span style="color: #48bb78; font-weight: 600;">Payment Completed</span>
          </div>
        </div>
        <div style="text-align: center;">
          <a href="${imageUrl}" class="cta-button" download>Download Images</a>
        </div>
        <div class="message">
          Click the button above to download your high-quality images. The download link will remain active for 30 days.
        </div>
      </div>
    `;

    const html = this.getEmailTemplate(content);
    await this.sendEmail(to, subject, text, html);
  }

  public async sendFailedPaymentConfirmationEmail(to: string, payload: any, name: string): Promise<void> {
    const subject = 'Payment Failed - Niptrex';
    const text = `Hi ${name},

Payment for Proposal: ${payload.proposalId}
with job: ${payload.jobTitle} failed`;

    const content = `
      <div class="content">
        <div class="greeting">Hi ${name}! ⚠️</div>
        <div class="message">
          We encountered an issue processing your payment. Please review the details below and try again.
        </div>
        <div class="info-box">
          <div class="info-title">Payment Details</div>
          <div class="info-text">
            <strong>Proposal ID:</strong> ${payload.proposalId}<br>
            <strong>Job Title:</strong> ${payload.jobTitle}<br>
            <strong>Status:</strong> <span style="color: #e53e3e; font-weight: 600;">Failed</span>
          </div>
        </div>
        <div style="text-align: center;">
          <a href="https://niptrex.com/dashboard" class="cta-button">Retry Payment</a>
        </div>
        <div class="message">
          Please check your payment method and try again. If the issue persists, contact our support team for assistance.
        </div>
      </div>
    `;

    const html = this.getEmailTemplate(content);
    await this.sendEmail(to, subject, text, html);
  }

  public async sendSuccessfulRegistration(to: string, token: string, name: string): Promise<void> {
    const subject = 'Welcome to Niptrex - Verify Your Email';
    const verificationEmailUrl = `https://niptrex.com/auth/verify-email?token=${token}`;
    const text = `Hi ${name},

Congratulations! Your account has been created.

You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}

Don't hesitate to contact us if you face any problems

Regards,
Team`;

    const content = `
      <div class="content">
        <div class="greeting">Welcome to Niptrex, ${name}! 🎉</div>
        <div class="message">
          Congratulations! Your account has been successfully created. You're just one step away from accessing all our features.
        </div>
        <div style="text-align: center;">
          <a href="${verificationEmailUrl}" class="cta-button">Verify Email Address</a>
        </div>
        <div class="info-box">
          <div class="info-title">What's Next?</div>
          <div class="info-text">
            After verifying your email, you'll be able to:
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Access your personalized dashboard</li>
              <li>Start exploring our services</li>
              <li>Connect with our community</li>
            </ul>
          </div>
        </div>
        <div class="divider"></div>
        <div class="message">
          Need help? Don't hesitate to contact our support team. We're here to help you get started!
        </div>
      </div>
    `;

    const html = this.getEmailTemplate(content);
    await this.sendEmail(to, subject, text, html);
  }

  public sendAccountCreated = async (to: string, name: string): Promise<void> => {
    const subject = 'Account Created Successfully - Niptrex';
    const loginUrl = `https://niptrex.com/auth/login`;
    const text = `Hi ${name},

Congratulations! Your account has been created successfully.

You can now login at: ${loginUrl}

Don't hesitate to contact us if you face any problems

Regards,
Team`;

    const content = `
      <div class="content">
        <div class="greeting">Account Ready, ${name}! 🚀</div>
        <div class="message">
          Excellent! Your Niptrex account has been successfully created and verified. 
          You can now access all our features and services.
        </div>
        <div style="text-align: center;">
          <a href="${loginUrl}" class="cta-button">Login to Your Account</a>
        </div>
        <div class="info-box">
          <div class="info-title">Getting Started</div>
          <div class="info-text">
            Now that your account is ready, you can:
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Complete your profile setup</li>
              <li>Explore available services</li>
              <li>Start your first project</li>
              <li>Connect with other users</li>
            </ul>
          </div>
        </div>
        <div class="divider"></div>
        <div class="message">
          Welcome to the Niptrex community! If you have any questions or need assistance, 
          our support team is always ready to help.
        </div>
      </div>
    `;

    const html = this.getEmailTemplate(content);
    await this.sendEmail(to, subject, text, html);
  };
}

export default EmailService;
