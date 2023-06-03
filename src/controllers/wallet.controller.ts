import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import WalletService from '@/services/wallet.service';
import { IUpdateWallet } from '@/models/wallet.model';

class WalletController {
  public userService = new UserService();
  public walletService = new WalletService();

  /*
  |--------------------------------------------------------------------------
  | Create Bio
  |--------------------------------------------------------------------------
  */
  public createWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const wallet = await this.walletService.getWalletByUserId(req.user.id);
      if (!wallet) throw new HttpException(400, 6002, 'WALLET_ALREAD_CREATED');

      const data = await this.walletService.createWallet({ ...userData, user_id: req.user.id });

      res.status(200).json({ status: 200, response_code: 6000, message: 'WALLET_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get User Bio
  |--------------------------------------------------------------------------
  */
  public getUserWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.walletService.getWalletByUserId(req.user.id);

      res.status(200).json({ status: 200, response_code: 6000, message: 'WALLET_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Bio By Id
  |--------------------------------------------------------------------------
  */
  public getWalletById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.walletService.getWalletByUserId(id);

      res.status(200).json({ status: 200, response_code: 6000, message: 'WALLET_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update Bio
  |--------------------------------------------------------------------------
  */
  public updateBio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IUpdateWallet = req.body;
      const data = await this.walletService.updateWallet(req.params.id, body);

      res.status(200).json({ status: 200, response_code: 6000, message: 'WALLET_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default WalletController;
