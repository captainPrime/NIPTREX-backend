import { Routes } from '../interfaces/routes.interface';
import RatingController from '../controllers/rating.controller';
declare class RatingRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    ratingController: RatingController;
    constructor();
    private initializeRoutes;
}
export default RatingRoute;
