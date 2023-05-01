import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import { IUpdateAbout } from '@/interfaces/profile.interface';
import AboutService from '@/services/about.service';

class AboutController {
  public userService = new UserService();
  public aboutService = new AboutService();

  /*
  |--------------------------------------------------------------------------
  | Create About
  |--------------------------------------------------------------------------
  */
  public createAbout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const about = await this.aboutService.getUserAbout(req.user.id);
      console.log('ABOUT', about);
      if (about) throw new HttpException(400, 5002, 'ABOUT_ALREADY_ADDED');

      const { first_name, last_name, email, country, id } = req.user;

      const payload = {
        ...userData,
        user_id: id,
        personal_details: {
          ...userData.personal_details,
          first_name,
          last_name,
          email,
          country,
        },
      };
      const data = await this.aboutService.createAbout(payload);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get User About
  |--------------------------------------------------------------------------
  */
  public getUserAbout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const data = await this.aboutService.getUserAbout(req.user.id);
      if (!data) throw new HttpException(400, 2002, 'ABOUT_NOT_FOUND');

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get About By Id
  |--------------------------------------------------------------------------
  */
  public getAboutById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.aboutService.getAboutById(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update About
  |--------------------------------------------------------------------------
  */
  public updateAbout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IUpdateAbout = req.body;

      const data = await this.aboutService.updateAboutById(req.user.id, body);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update About
  |--------------------------------------------------------------------------
  */
  public updateResumeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: any = req.body;
      const { id } = req.params;

      const data = await this.aboutService.updateResumeById(req.user.id, body, id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete About
  |--------------------------------------------------------------------------
  */
  public deleteAbout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.aboutService.deleteAbout(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default AboutController;
