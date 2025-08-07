import { NextFunction, Request, Response } from 'express';
import UserService from '../services/users.service';
import BioService from '../services/bio.service';
declare class BioController {
    userService: UserService;
    bioService: BioService;
    createBio: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserBio: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBioById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateBio: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteBio: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default BioController;
