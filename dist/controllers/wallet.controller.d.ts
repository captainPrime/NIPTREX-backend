import { NextFunction, Request, Response } from 'express';
import UserService from '../services/users.service';
import WalletService from '../services/wallet.service';
import EmailService from '../modules/email/email.service';
import BidService from '../services/bid.service';
import JobService from '../services/job.service';
import AboutService from '../services/about.service';
declare class WalletController {
    bidService: BidService;
    jobService: JobService;
    userService: UserService;
    aboutService: AboutService;
    emailService: EmailService;
    walletService: WalletService;
    createWallet: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserTransaction: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTransactions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTransactionById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateWallet: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createTransaction: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    chargeCard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    makePayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    paymentCallback: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    paymentWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    disbursePayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default WalletController;
