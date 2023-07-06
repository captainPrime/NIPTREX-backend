import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import BankService from '@/services/bank.service';
import { IUpdateBio } from '@/interfaces/profile.interface';

class BankController {
  public userService = new UserService();
  public bankService = new BankService();

  /*
  |--------------------------------------------------------------------------
  | Add bank
  |--------------------------------------------------------------------------
  */
  public createBank = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const bio = await this.bankService.getUserBank(req.user.id);
      if (bio.length !== 0) throw new HttpException(400, 9002, 'BIO_ALREAD_ADDED');

      const data = await this.bankService.addBankInfo({ ...userData, user_id: req.user.id });

      res.status(200).json({ status: 200, response_code: 9000, message: 'BANK_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get User Bank
  |--------------------------------------------------------------------------
  */
  public getUserBank = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.bankService.getUserBank(req.user.id);

      res.status(200).json({ status: 200, response_code: 9000, message: 'BANK_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Bank By Id
  |--------------------------------------------------------------------------
  */
  public getBankById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.bankService.getBankById(id);

      res.status(200).json({ status: 200, response_code: 9000, message: 'BANK_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update Bank Info
  |--------------------------------------------------------------------------
  */
  public updateBankInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IUpdateBio = req.body;
      const data = await this.bankService.updateBankInfo(req.user.id, body);

      res.status(200).json({ status: 200, response_code: 9000, message: 'BANK_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Bank Info
  |--------------------------------------------------------------------------
  */
  public deleteBankInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.bankService.deleteBank(id);

      res.status(200).json({ status: 200, response_code: 9000, message: 'BANK_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default BankController;
