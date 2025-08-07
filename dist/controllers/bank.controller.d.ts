import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import BankService from '@/services/bank.service';
declare class BankController {
    userService: UserService;
    bankService: BankService;
    createBank: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserBank: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBankById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateBankInfo: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteBankInfo: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default BankController;
