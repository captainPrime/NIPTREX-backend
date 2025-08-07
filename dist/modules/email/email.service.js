"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const config_1 = require("../../config");
const logger_1 = require("../../utils/logger");
class EmailService {
    constructor() {
        this.transport = nodemailer_1.default.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: config_1.MAIL_USERNAME,
                pass: config_1.MAIL_PASSWORD,
            },
        });
        this.sendAccountCreated = async (to, name) => {
            const subject = 'Account Created Successfully';
            // replace this url with the link to the email verification page of your front-end app
            const loginUrl = `http://${config_1.CLIENT_URL}/auth/login`;
            const text = `Hi ${name},
    Congratulations! Your account has been created successfully. 
    You can now login at: ${loginUrl}
    Don't hesitate to contact us if you face any problems
    Regards,
    Team`;
            const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
    <p>Congratulations! Your account has been created successfully.</p>
    <p>You can now login at: ${loginUrl}</p>
    <p>Don't hesitate to contact us if you face any problems</p>
    <p>Regards,</p>
    <p><strong>Team</strong></p></div>`;
            await this.sendEmail(to, subject, text, html);
        };
        if (config_1.NODE_ENV !== 'test') {
            this.transport
                .verify()
                .then(() => logger_1.logger.info('Connected to email server'))
                .catch(() => logger_1.logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
        }
    }
    async sendEmail(to, subject, text, html) {
        const msg = {
            from: `no-reply@interpockethq.com<${config_1.MAIL_USERNAME}>`,
            to,
            subject,
            text,
            html,
        };
        await this.transport.sendMail(msg);
    }
    async sendResetPasswordEmail(to, token) {
        const subject = 'Reset password';
        // replace this url with the link to the reset password page of your front-end app
        const resetPasswordUrl = `http://${config_1.CLIENT_URL}/reset-password?token=${token}`;
        const text = `Hi,
      To reset your password, click on this link: ${resetPasswordUrl}
      If you did not request any password resets, then ignore this email.`;
        const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
      <p>To reset your password, click on this link: ${resetPasswordUrl}</p>
      <p>If you did not request any password resets, please ignore this email.</p>
      <p>Thanks,</p>
      <p><strong>Team</strong></p></div>`;
        await this.sendEmail(to, subject, text, html);
    }
    async sendVerificationEmail(to, token, name) {
        const subject = 'Email Verification';
        // replace this url with the link to the email verification page of your front-end app
        const verificationEmailUrl = `http://${config_1.CLIENT_URL}/verify-email?token=${token}`;
        const text = `Hi ${name},
      To verify your email, click on this link: ${verificationEmailUrl}
      If you did not create an account, then ignore this email.`;
        const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
      <p>To verify your email, click on this link: ${verificationEmailUrl}</p>
      <p>If you did not create an account, then ignore this email.</p></div>`;
        await this.sendEmail(to, subject, text, html);
    }
    async sendMilestoneReviewEmail(to, payload, name) {
        const subject = 'Milestone Review';
        // replace this url with the link to the email verification page of your front-end app
        // const verificationEmailUrl = `http://${CLIENT_URL}/verify-email?token=${token}`;
        const text = `Hi ${name},
      Milestone: ${payload.milestoneDescription}
      is ready for review`;
        const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
      <p>Milestone: ${payload.milestoneDescription}</p>
      <p>is ready for review.</p></div>`;
        await this.sendEmail(to, subject, text, html);
    }
    async sendOutrightReviewEmail(to, payload, name) {
        const subject = 'Proposal Review';
        // replace this url with the link to the email verification page of your front-end app
        // const verificationEmailUrl = `http://${CLIENT_URL}/verify-email?token=${token}`;
        const text = `Hi ${name},
      Proposal with: ${payload.proposalType}
      is ready for review`;
        const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
      <p>Proposal with: ${payload.proposalType}</p>
      <p>is ready for review.</p></div>`;
        await this.sendEmail(to, subject, text, html);
    }
    async sendServiceReviewEmail(to, payload, name) {
        const subject = 'Service Review';
        // replace this url with the link to the email verification page of your front-end app
        // const verificationEmailUrl = `http://${CLIENT_URL}/verify-email?token=${token}`;
        const text = `Hi ${name},
    Service with: ${payload.serviceName}
      is ready for review`;
        const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
      <p>Service with: ${payload.serviceName}</p>
      <p>is ready for review.</p></div>`;
        await this.sendEmail(to, subject, text, html);
    }
    async sendPaymentConfirmationEmail(to, payload, name) {
        const subject = 'Payment Confirmation';
        // replace this url with the link to the email verification page of your front-end app
        // const verificationEmailUrl = `http://${CLIENT_URL}/verify-email?token=${token}`;
        const text = `Hi ${name},
    Payment for
      Proposal: ${payload.proposalId}
      with job: ${payload.jobTitle} was made`;
        const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
      <p>Payment for Proposal: ${payload.proposalId}
      <p>with Job: ${payload.jobTitle}</p>
      <p>was made.</p></div>`;
        await this.sendEmail(to, subject, text, html);
    }
    async sendPhotographyPaymentConfirmationEmail(to, payload, name) {
        const subject = 'Payment Confirmation';
        const text = `Hi ${name},
    Payment for Photography: ${payload.photographyTitle} was made`;
        const imageUrl = payload.imageUrl; // Assuming imageUrl is part of the payload
        const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;">
        <h4><strong>Hi ${name},</strong></h4>
        <p>Payment for Photography: ${payload.photographyTitle} was made.</p>
        <p>Image Download Link: <a href="${imageUrl}" download>Download Image</a></p>
    </div>`;
        await this.sendEmail(to, subject, text, html);
    }
    async sendFailedPaymentConfirmationEmail(to, payload, name) {
        const subject = 'Payment Confirmation';
        // replace this url with the link to the email verification page of your front-end app
        // const verificationEmailUrl = `http://${CLIENT_URL}/verify-email?token=${token}`;
        const text = `Hi ${name},
    Payment for
      Proposal: ${payload.proposalId}
      with job: ${payload.jobTitle} failed`;
        const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
      <p>Payment for Proposal: ${payload.proposalId}
      <p>with Job: ${payload.jobTitle}</p>
      <p>failed.</p></div>`;
        await this.sendEmail(to, subject, text, html);
    }
    async sendSuccessfulRegistration(to, token, name) {
        const subject = 'Email Verification';
        // replace this url with the link to the email verification page of your front-end app
        const verificationEmailUrl = `http://${config_1.CLIENT_URL}/verify-email?token=${token}`;
        const text = `Hi ${name},
  Congratulations! Your account has been created. 
  You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
        const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created.</p>
  <p>You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
        await this.sendEmail(to, subject, text, html);
    }
}
exports.default = EmailService;
//# sourceMappingURL=email.service.js.map