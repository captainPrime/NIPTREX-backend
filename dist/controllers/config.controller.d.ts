import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import ConfigService from '@/services/config.service';
declare class ConfigController {
    userService: UserService;
    configService: ConfigService;
    createConfig: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllConfig: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getConfigById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateConfig: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteConfig: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default ConfigController;
