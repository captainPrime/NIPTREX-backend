import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import BidController from '@/controllers/bid.controller';
import JobController from '@/controllers/job.controller';
import authMiddleware from '@/middlewares/auth.middleware';

class BidRoute implements Routes {
  public path = '/bid';
  public router = Router();
  public bidController = new BidController();
  public jobController = new JobController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/proposals/archive/:id`, this.bidController.archiveProposal);
    this.router.get(`${this.path}/proposals/like/:id`, this.bidController.likeProposal);
    this.router.get(`${this.path}/proposals/dislike/:id`, this.bidController.dislikeProposal);
    this.router.get(`${this.path}/proposals/:id`, authMiddleware(['client']), this.bidController.getBidders);
    this.router.get(`${this.path}/proposals/:id/dislike`, this.bidController.getBidders);
    this.router.get(`${this.path}/getTopBidders/:id`, this.bidController.getTopBidders);
    this.router.post(`${this.path}/:id`, authMiddleware(['freelancer']), this.bidController.bidJob);
    this.router.post(`${this.path}/hire/:id`, authMiddleware(['client']), this.jobController.hireFreelancer);
  }
}

export default BidRoute;
