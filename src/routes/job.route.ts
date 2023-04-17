import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import JobController from '@/controllers/job.controller';
import authMiddleware from '@/middlewares/auth.middleware';

class JobRoute implements Routes {
  public path = '/job';
  public router = Router();
  public jobController = new JobController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.jobController.createJob);
    this.router.get(`${this.path}/getAllJobs`, this.jobController.getAllJobs);
    this.router.get(`${this.path}/mostRecents`, authMiddleware, this.jobController.getMostRecentJobs);
    this.router.get(`${this.path}/getUserJobBestMatches`, authMiddleware, this.jobController.getUserJobBestMatches);

    this.router.get(`${this.path}/skills`, this.jobController.getAllSkills);
    this.router.get(`${this.path}/softSkills`, this.jobController.getAllSoftSkills);
    this.router.get(`${this.path}/skillsCategory`, this.jobController.getAllSkillsCategory);
    this.router.get(`${this.path}/savedJobs`, authMiddleware, this.jobController.getUserSavedJobs);
    this.router.get(`${this.path}/getUserSavedItems`, authMiddleware, this.jobController.getUserSavedItems);
    this.router.get(`${this.path}/:id`, authMiddleware, this.jobController.getJobById);
    this.router.post(`${this.path}/saveJob/:id`, authMiddleware, this.jobController.savedJob);
    this.router.post(`${this.path}/unSaveJob/:id`, authMiddleware, this.jobController.unSaveJob);
  }
}

export default JobRoute;
