import { NextFunction, Request, Response } from 'express';
import ProfileService from '@/services/profile.service';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import { CreateProfileDto } from '@/dtos/profile.dto';

class ProfileController {
  public userService = new UserService();
  public profileService = new ProfileService();

  public createProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateProfileDto = req.body;
      const user: any = await this.userService.findUserById(req.user.id);

      if (user.has_profile) {
        throw new HttpException(400, 1003, 'USER_ALREADY_HAS_PROFILE');
      }

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const createUserData = await this.profileService.createProfile({ ...userData, user_id: req.user.id });

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data: createUserData });
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user.id;
      const findOneUserData = await this.profileService.getProfileById(userId);

      res.status(200).json({ status: 200, response_code: 2000, message: 'PROFILE_REQUEST_SUCCESSFUL', data: findOneUserData });
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user.id;
      console.log(req.body);
      const data = await this.profileService.updateProfile(userId, req.body);

      res.status(200).json({ status: 200, response_code: 2000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default ProfileController;
