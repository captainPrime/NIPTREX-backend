declare class EmailService {
    private transport;
    constructor();
    sendEmail(to: string, subject: string, text: string, html: string): Promise<void>;
    sendResetPasswordEmail(to: string, token: string): Promise<void>;
    sendVerificationEmail(to: string, token: string, name: string): Promise<void>;
    sendMilestoneReviewEmail(to: string, payload: any, name: string): Promise<void>;
    sendOutrightReviewEmail(to: string, payload: any, name: string): Promise<void>;
    sendServiceReviewEmail(to: string, payload: any, name: string): Promise<void>;
    sendPaymentConfirmationEmail(to: string, payload: any, name: string): Promise<void>;
    sendPhotographyPaymentConfirmationEmail(to: string, payload: any, name: string): Promise<void>;
    sendFailedPaymentConfirmationEmail(to: string, payload: any, name: string): Promise<void>;
    sendSuccessfulRegistration(to: string, token: string, name: string): Promise<void>;
    sendAccountCreated: (to: string, name: string) => Promise<void>;
}
export default EmailService;
