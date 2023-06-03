import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import WalletController from '@/controllers/wallet.controller';

class WalletRoute implements Routes {
  public path = '/wallet';
  public router = Router();
  public walletController = new WalletController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware(['freelancer', 'client']), this.walletController.createWallet);
    this.router.get(`${this.path}/getUserWallet`, authMiddleware(['freelancer', 'client']), this.walletController.getUserWallet);
    this.router.get(`${this.path}/getWalletById/:id`, authMiddleware(['freelancer', 'client']), this.walletController.getWalletById);
    this.router.put(`${this.path}/updateWallet/:id`, authMiddleware(['freelancer', 'client']), this.walletController.updateWallet);
  }
}

export default WalletRoute;
