import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import AboutService from '@/services/about.service';
declare class AboutController {
    userService: UserService;
    aboutService: AboutService;
    createAbout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserAbout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAboutById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateAbout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateResumeById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteResumeById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteAbout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default AboutController;
