import { NextFunction, Request, Response } from 'express';
import UserService from '../services/users.service';
import IdentityService from '../services/identity.service';
declare class IdentityController {
    userService: UserService;
    identityService: IdentityService;
    createIdentity: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserIdentity: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getIdentityById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateIdentity: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteIdentity: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default IdentityController;
