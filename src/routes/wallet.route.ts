import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import WalletController from '@/controllers/wallet.controller';

class WalletRoute implements Routes {
  public path = '/payment';
  public router = Router();
  public walletController = new WalletController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.post(`${this.path}`, authMiddleware(['freelancer', 'client']), this.walletController.createWallet);
    this.router.post(`${this.path}`, authMiddleware(['freelancer', 'client']), this.walletController.makePayment);
    this.router.post(`${this.path}/webhook`, authMiddleware(['freelancer', 'client']), this.walletController.paymentWebhook);
    this.router.post(`${this.path}/callback`, this.walletController.paymentCallback);
    this.router.post(`${this.path}/transaction`, authMiddleware(['freelancer', 'client']), this.walletController.createTransaction);
    this.router.get(`${this.path}/getTransactions`, authMiddleware(['freelancer', 'client']), this.walletController.getTransactions);
    this.router.get(`${this.path}/getUserTransaction`, authMiddleware(['freelancer', 'client']), this.walletController.getUserTransaction);
    this.router.get(`${this.path}/getTransactionById/:id`, authMiddleware(['freelancer', 'client']), this.walletController.getTransactionById);
    this.router.put(`${this.path}/updateWallet/:id`, authMiddleware(['freelancer', 'client']), this.walletController.updateWallet);
  }
}

export default WalletRoute;
