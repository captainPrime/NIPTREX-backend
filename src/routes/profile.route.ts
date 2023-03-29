import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import ProfileController from '@/controllers/profile.controller';
import EducationController from '@/controllers/education.controller';

class ProfileRoute implements Routes {
  public path = '/profile';
  public router = Router();
  public profileController = new ProfileController();
  public educationController = new EducationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /*
    |--------------------------------------------------------------------------
    | Experience Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/experience`, authMiddleware, this.profileController.createExperience);
    this.router.get(`${this.path}/experience`, authMiddleware, this.profileController.getUserExperience);
    this.router.put(`${this.path}/experience/:id`, authMiddleware, this.profileController.updateExperience);
    this.router.delete(`${this.path}/experience/:id`, authMiddleware, this.profileController.deleteExperience);
    this.router.get(`${this.path}/experience/:id`, authMiddleware, this.profileController.getExperienceById);

    /*
    |--------------------------------------------------------------------------
    | Education Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/education`, authMiddleware, this.educationController.createEducation);
    this.router.get(`${this.path}/education`, authMiddleware, this.educationController.getUserEducation);
    this.router.put(`${this.path}/education/:id`, authMiddleware, this.educationController.updateEducation);
    this.router.delete(`${this.path}/education/:id`, authMiddleware, this.educationController.deleteEducation);
    this.router.get(`${this.path}/education/:id`, authMiddleware, this.educationController.getEducationById);
  }
}

export default ProfileRoute;
