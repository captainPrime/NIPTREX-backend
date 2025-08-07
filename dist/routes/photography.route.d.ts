import { Routes } from '@interfaces/routes.interface';
import PhotographyController from '@/controllers/photography.controller';
declare class PhotographyRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    photographyController: PhotographyController;
    constructor();
    private initializeRoutes;
}
export default PhotographyRoute;
