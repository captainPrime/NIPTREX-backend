import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import BioService from '@/services/bio.service';
import { IUpdateBio } from '@/interfaces/profile.interface';

class BioController {
  public userService = new UserService();
  public bioService = new BioService();

  /*
  |--------------------------------------------------------------------------
  | Create Bio
  |--------------------------------------------------------------------------
  */
  public createBio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const bio = await this.bioService.getBioById(req.user.id);
      if (bio.length !== 0) throw new HttpException(400, 5002, 'BIO_ALREAD_ADDED');

      const data = await this.bioService.createBio({ ...userData, user_id: req.user.id });

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get User Bio
  |--------------------------------------------------------------------------
  */
  public getUserBio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.bioService.getUserBio(req.user.id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Bio By Id
  |--------------------------------------------------------------------------
  */
  public getBioById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.bioService.getBioById(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
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
      const body: IUpdateBio = req.body;
      const data = await this.bioService.updateBioById(req.user.id, body);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Bio
  |--------------------------------------------------------------------------
  */
  public deleteBio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.bioService.deleteBio(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default BioController;
