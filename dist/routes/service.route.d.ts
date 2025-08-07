import { Routes } from '../interfaces/routes.interface';
import ServiceController from '../controllers/service.controller';
declare class ServiceRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    serviceController: ServiceController;
    constructor();
    private initializeRoutes;
}
export default ServiceRoute;
