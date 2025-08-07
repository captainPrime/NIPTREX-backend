import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import EducationService from '@/services/education.service';
declare class EducationController {
    userService: UserService;
    educationService: EducationService;
    createEducation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserEducation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getEducationById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateEducation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteEducation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default EducationController;
