import { NextFunction, Request, Response } from 'express';
import ProfileService from '@/services/profile.service';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';

class ProfileController {
  public userService = new UserService();
  public profileService = new ProfileService();

  public createProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const user: any = await this.userService.findUserById(req.user.id);

      if (user.has_profile) {
        throw new HttpException(400, 1003, 'USER_ALREADY_HAS_PROFILE');
      }

      const createUserData = await this.profileService.createProfile({ ...userData, user_id: req.user.id });

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data: createUserData });
    } catch (error) {
      next(error);
    }
  };
}

export default ProfileController;
