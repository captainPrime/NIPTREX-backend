import { Routes } from '../interfaces/routes.interface';
import WalletController from '../controllers/wallet.controller';
declare class WalletRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    walletController: WalletController;
    constructor();
    private initializeRoutes;
}
export default WalletRoute;
