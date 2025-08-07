import { NextFunction, Request, Response } from 'express';
import ProfileService from '../services/profile.service';
import UserService from '../services/users.service';
declare class ProfileController {
    userService: UserService;
    profileService: ProfileService;
    getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getDirectProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProfileByUserId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createExperience: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserExperience: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getExperienceById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateExperience: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteExperience: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default ProfileController;
