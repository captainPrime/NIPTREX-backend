import nodemailer from 'nodemailer';
import { MAIL_USERNAME, NODE_ENV, CLIENT_URL, MAIL_PASSWORD } from '@/config';
import { logger } from '../../utils/logger';
import { Message } from './email.interfaces';

class EmailService {
  private transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
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

  public async sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {
    const msg: Message = {
      from: `no-reply@interpockethq.com<${MAIL_USERNAME}>`,
      to,
      subject,
      text,
      html,
    };
    await this.transport.sendMail(msg);
  }

  public async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const subject = 'Reset password';
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `http://${CLIENT_URL}/reset-password?token=${token}`;
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

  public async sendVerificationEmail(to: string, token: string, name: string): Promise<void> {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `http://${CLIENT_URL}/verify-email?token=${token}`;
    const text = `Hi ${name},
      To verify your email, click on this link: ${verificationEmailUrl}
      If you did not create an account, then ignore this email.`;
    const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
      <p>To verify your email, click on this link: ${verificationEmailUrl}</p>
      <p>If you did not create an account, then ignore this email.</p></div>`;
    await this.sendEmail(to, subject, text, html);
  }

  public async sendSuccessfulRegistration(to: string, token: string, name: string): Promise<void> {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `http://${CLIENT_URL}/verify-email?token=${token}`;
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

  public sendAccountCreated = async (to: string, name: string): Promise<void> => {
    const subject = 'Account Created Successfully';
    // replace this url with the link to the email verification page of your front-end app
    const loginUrl = `http://${CLIENT_URL}/auth/login`;
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
}

export default EmailService;
