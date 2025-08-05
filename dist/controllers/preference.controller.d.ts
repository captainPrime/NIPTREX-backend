import { NextFunction, Request, Response } from 'express';
import UserService from '../services/users.service';
import PreferenceService from '../services/preference.service';
declare class PreferenceController {
    userService: UserService;
    preferenceService: PreferenceService;
    createPreference: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserPreference: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPreferenceById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updatePreference: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deletePreference: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default PreferenceController;
