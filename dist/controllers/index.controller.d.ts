import { NextFunction, Request, Response } from 'express';
declare class IndexController {
    users: import("../interfaces/users.interface").IUserModel;
    rating: any;
    bid: any;
    job: any;
    chat: any;
    message: any;
    hire: any;
    saveJob: any;
    about: any;
    billing: any;
    identity: any;
    education: any;
    experience: any;
    preference: any;
    certification: any;
    service: any;
    serviceProposal: any;
    photography: any;
    index: (req: Request, res: Response, next: NextFunction) => void;
    reloadDb: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default IndexController;
