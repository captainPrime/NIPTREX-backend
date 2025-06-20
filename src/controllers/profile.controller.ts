import { NextFunction, Request, Response } from 'express';
import ProfileService from '@/services/profile.service';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import { IUpdateExperience } from '@/interfaces/profile.interface';
// import { CreateProfileDto } from '@/dtos/profile.dto';

class ProfileController {
  public userService = new UserService();
  public profileService = new ProfileService();

  public getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.query.id ?? req.user.id;
      const findOneUserData = await this.profileService.getProfile(userId);

      res.status(200).json({ status: 200, response_code: 2000, message: 'PROFILE_REQUEST_SUCCESSFUL', data: findOneUserData });
    } catch (error) {
      next(error);
    }
  };

  public getDirectProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.query.id ?? req.user.id;
      const findOneUserData = await this.profileService.getDirectProfile(userId);

      res.status(200).json({ status: 200, response_code: 2000, message: 'PROFILE_REQUEST_SUCCESSFUL', data: findOneUserData });
    } catch (error) {
      next(error);
    }
  };

  public getProfileByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: any = req.query.id;
      const findOneUserData = await this.profileService.getProfile(userId);

      res.status(200).json({ status: 200, response_code: 2000, message: 'PROFILE_REQUEST_SUCCESSFUL', data: findOneUserData });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Create Experience
  |--------------------------------------------------------------------------
  */
  public createExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const data = await this.profileService.createExperience({ ...userData, user_id: req.user.id });

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get User Experience
  |--------------------------------------------------------------------------
  */
  public getUserExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const data = await this.profileService.getUserExperience(req.user.id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Experience By Id
  |--------------------------------------------------------------------------
  */
  public getExperienceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.profileService.getExperienceById(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update Experience
  |--------------------------------------------------------------------------
  */
  public updateExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const body: IUpdateExperience = req.body;
      const data = await this.profileService.updateExperienceById(id, body);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Experience
  |--------------------------------------------------------------------------
  */
  public deleteExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.profileService.deleteExperience(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default ProfileController;
