import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import PhotographyController from '@/controllers/photography.controller';
import { upload } from '@/utils/multerConfig';

class PhotographyRoute implements Routes {
  public path = '/photography';
  public router = Router();
  public photographyController = new PhotographyController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware(['freelancer']), upload.single('image'), this.photographyController.createPhotography);
    this.router.get(`${this.path}/getPhotographyById/:id`, authMiddleware(['freelancer']), this.photographyController.getPhotographyById);
    this.router.put(`${this.path}/updateInvoice/:id`, authMiddleware(['freelancer']), this.photographyController.updatePhotography);
    this.router.get(`${this.path}/getUserPhotography`, authMiddleware(['freelancer']), this.photographyController.getUserPhotography);
  }
}

export default PhotographyRoute;
