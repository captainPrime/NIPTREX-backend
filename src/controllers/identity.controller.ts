import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import { IUpdateDocument } from '@/interfaces/profile.interface';
import IdentityService from '@/services/identity.service';

class IdentityController {
  public userService = new UserService();
  public identityService = new IdentityService();

  /*
  |--------------------------------------------------------------------------
  | Create Identity
  |--------------------------------------------------------------------------
  */
  public createIdentity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const identity = await this.identityService.getUserIdentity(req.user.id);
      if (identity.length !== 0) throw new HttpException(400, 5002, 'IDENTITY_ALREAD_ADDED');

      const data = await this.identityService.createIdentity({ ...userData, user_id: req.user.id });

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get User Identity
  |--------------------------------------------------------------------------
  */
  public getUserIdentity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const data = await this.identityService.getUserIdentity(req.user.id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Identity By Id
  |--------------------------------------------------------------------------
  */
  public getIdentityById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.identityService.getIdentityById(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update Identity
  |--------------------------------------------------------------------------
  */
  public updateIdentity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IUpdateDocument = req.body;
      const data = await this.identityService.updateIdentityById(req.user.id, body);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Identity
  |--------------------------------------------------------------------------
  */
  public deleteIdentity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.identityService.deleteIdentity(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default IdentityController;
