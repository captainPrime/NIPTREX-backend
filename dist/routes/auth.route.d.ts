import { Routes } from '../interfaces/routes.interface';
import AuthController from '../controllers/auth.controller';
declare class AuthRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    authController: AuthController;
    constructor();
    private initializeRoutes;
}
export default AuthRoute;
