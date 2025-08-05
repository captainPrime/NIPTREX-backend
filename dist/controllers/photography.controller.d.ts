import { NextFunction, Request, Response } from 'express';
import UserService from '../services/users.service';
import PhotographyService from '../services/photography.service';
import WalletService from '../services/wallet.service';
import EmailService from '../modules/email/email.service';
declare class PhotographyController {
    userService: UserService;
    emailService: EmailService;
    walletService: WalletService;
    photographyService: PhotographyService;
    createPhotography: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    private uploadToCloudinary;
    getUserPhotography: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllPhotography: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPhotographyById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deletePhotography: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    makePayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    paymentCallback: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default PhotographyController;
