import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import { IUpdateBilling } from '@/interfaces/profile.interface';
import BillingService from '@/services/billing.service';

class BillingController {
  public userService = new UserService();
  public billingService = new BillingService();

  /*
  |--------------------------------------------------------------------------
  | Create Billing
  |--------------------------------------------------------------------------
  */
  public createBilling = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const billing = await this.billingService.getUserBilling(req.user.id);
      if (billing.length !== 0) throw new HttpException(400, 5002, 'BILLING_ALREAD_ADDED');

      const data = await this.billingService.createBilling({ ...userData, user_id: req.user.id });

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get User Billing
  |--------------------------------------------------------------------------
  */
  public getUserBilling = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const data = await this.billingService.getUserBilling(req.user.id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Billing By Id
  |--------------------------------------------------------------------------
  */
  public getBillingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.billingService.getBillingById(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update Billing
  |--------------------------------------------------------------------------
  */
  public updateBilling = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IUpdateBilling = req.body;
      const data = await this.billingService.updateBillingById(req.user.id, body);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Billing
  |--------------------------------------------------------------------------
  */
  public deleteBilling = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.billingService.deleteBilling(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default BillingController;
