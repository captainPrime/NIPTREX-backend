import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import ProfileController from '@/controllers/profile.controller';

class ProfileRoute implements Routes {
  public path = '/profile';
  public router = Router();
  public profileController = new ProfileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/experience`, authMiddleware, this.profileController.createExperience);
    this.router.get(`${this.path}/experience`, authMiddleware, this.profileController.getUserExperience);
    this.router.put(`${this.path}/experience/:id`, authMiddleware, this.profileController.updateExperience);
    this.router.delete(`${this.path}/experience/:id`, authMiddleware, this.profileController.deleteExperience);
    this.router.get(`${this.path}/experience/:id`, authMiddleware, this.profileController.getExperienceById);
  }
}

export default ProfileRoute;
