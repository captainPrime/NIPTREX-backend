import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import WalletService from '@/services/wallet.service';
import { IUpdateWallet, IWallet } from '@/models/wallet.model';
import { flw } from '@/modules/flutterwave';
import { generateUUID } from '@/utils/matchPercentage';

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
      // const userData = req.body;
      const user: any = await this.userService.findUserById(req.user.id);

      console.log('USER', user);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const wallet = await this.walletService.getWalletByUserId(req.user.id);
      if (wallet) throw new HttpException(400, 6002, 'WALLET_ALREAD_CREATED');

      //   const headers = {
      //     'Content-Type': 'application/json',
      //     Accept: 'application/json',
      //     Authorization: `Bearer ${FLW_SECRET_KEY}`,
      //   };

      //   const response = await axios.post(
      //     'https://api.flutterwave.com/v3/payout-subaccounts',
      //     {
      //       account_reference: generateAlphaNumeric(20),
      //       email: user.email,
      //       mobilenumber: user.phone_number,
      //       country: 'NG',
      //       account_name: `${user.first_name} ${user.last_name}`,
      //       bank_code: 232,
      //       barter_id: '00874000',
      //     },
      //     { headers },
      //   );

      //   console.log('SUB_ACCOUNT', response);

      const result = await flw.VirtualAcct.create({
        tx_ref: generateUUID(),
        email: user.email,
        bvn: '19218268983',
        is_permanent: true,
        // firstname: user.first_name,
        // lastname: user.last_name,
        narration: 'Niptrix Wallet',
      });

      console.log(result);

      if (result.status !== 'success' && result.data.response_code !== '02') throw new HttpException(400, 6002, 'ERROR_CREATING_WALLET');

      const payload: IWallet | any = {
        user_id: req.user.id,
        currency: req.body.currency,
        expiry_date: result.data.expiry_date,
        account_number: result.data.account_number,
        account_status: result.data.account_status,
        bank_name: result.data.bank_name,
        order_ref: result.data.order_ref,
        flw_ref: result.data.flw_ref,
        amount: result.data.amount === 'NaN' ? '0' : result.data.amount,
      };
      const data = await this.walletService.createWallet(payload);

      res.status(200).json({ status: 200, response_code: 6000, message: 'WALLET_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      console.log(error);
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
      const data = await this.walletService.getWalletById(id);

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
  public updateWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IUpdateWallet = req.body;
      const data = await this.walletService.updateWallet(req.params.id, body);

      res.status(200).json({ status: 200, response_code: 6000, message: 'WALLET_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Create Bio
  |--------------------------------------------------------------------------
  */
  public createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payloadData = req.body;

      const data = await this.walletService.createTransaction(payloadData);

      res.status(200).json({ status: 200, response_code: 6000, message: 'WALLET_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default WalletController;
