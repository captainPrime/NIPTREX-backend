import RatingService from '../services/rating.service';
import { NextFunction, Request, Response } from 'express';
import UserService from '../services/users.service';
import JobService from '../services/job.service';
import ServiceService from '../services/service.service';
declare class RatingController {
    ratingService: RatingService;
    userService: UserService;
    jobService: JobService;
    serviceService: ServiceService;
    rateEntity: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getRatingById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getRatingByUserId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserRating: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllRatings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    unRateEntity: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default RatingController;
