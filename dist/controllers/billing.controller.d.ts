import { NextFunction, Request, Response } from 'express';
import UserService from '../services/users.service';
import BillingService from '../services/billing.service';
declare class BillingController {
    userService: UserService;
    billingService: BillingService;
    createBilling: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserBilling: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBillingById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateBilling: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteBilling: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default BillingController;
