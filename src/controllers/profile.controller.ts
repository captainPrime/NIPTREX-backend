import { NextFunction, Request, Response } from 'express';
import ProfileService from '@/services/profile.service';

class ProfileController {
  public profileService = new ProfileService();

  public createProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const createUserData = await this.profileService.createProfile({ ...userData, user_id: req.user.id });

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data: createUserData });
    } catch (error) {
      next(error);
    }
  };
}

export default ProfileController;
