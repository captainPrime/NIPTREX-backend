import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import BidController from '@/controllers/bid.controller';

class BidRoute implements Routes {
  public path = '/bid';
  public router = Router();
  public bidController = new BidController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/getTopBidders`, this.bidController.getTopBidders);
    this.router.post(`${this.path}/:id`, authMiddleware(['freelancer']), this.bidController.bidJob);
  }
}

export default BidRoute;
