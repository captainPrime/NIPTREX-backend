import { Routes } from '@interfaces/routes.interface';
import JobController from '@/controllers/job.controller';
declare class JobRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    jobController: JobController;
    constructor();
    private initializeRoutes;
}
export default JobRoute;
