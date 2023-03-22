import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import ProfileController from '@/controllers/profile.controller';
import RequestValidator from '@/middlewares/validation.middleware';
import { CreateProfileDto } from '@/dtos/profile.dto';

class ProfileRoute implements Routes {
  public path = '/profile';
  public router = Router();
  public profileController = new ProfileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware, this.profileController.createProfile);
  }
}

export default ProfileRoute;
