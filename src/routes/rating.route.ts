import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import RatingController from '@/controllers/rating.controller';

class RatingRoute implements Routes {
  public path = '/rate';
  public router = Router();
  public ratingController = new RatingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/:id`, authMiddleware(['freelancer', 'client']), this.ratingController.rateEntity);
    this.router.get(`${this.path}/getRatingById/:id`, authMiddleware(['freelancer', 'client']), this.ratingController.getRatingById);
    this.router.get(`${this.path}/getRatingByUserId/:id`, authMiddleware(['freelancer', 'client']), this.ratingController.getRatingByUserId);
    this.router.get(`${this.path}/getUserRating`, authMiddleware(['freelancer', 'client']), this.ratingController.getUserRating);
    this.router.get(`${this.path}`, authMiddleware(['freelancer', 'client']), this.ratingController.getAllRatings);
    this.router.put(`${this.path}/unRateEntity/:id`, authMiddleware(['freelancer', 'client']), this.ratingController.unRateEntity);
  }
}

export default RatingRoute;
