import { Routes } from '@interfaces/routes.interface';
import ConfigController from '@/controllers/config.controller';
declare class ConfigRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    configController: ConfigController;
    constructor();
    private initializeRoutes;
}
export default ConfigRoute;
