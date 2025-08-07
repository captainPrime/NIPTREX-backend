import { Routes } from '@interfaces/routes.interface';
import BidController from '@/controllers/bid.controller';
import JobController from '@/controllers/job.controller';
declare class BidRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    bidController: BidController;
    jobController: JobController;
    constructor();
    private initializeRoutes;
}
export default BidRoute;
