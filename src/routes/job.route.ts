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
    this.router.get(`${this.path}/getAllJobs`, this.jobController.getAllJobs);
    this.router.post(`${this.path}`, authMiddleware(['client']), this.jobController.createJob);
    this.router.put(`${this.path}/update`, authMiddleware(['client']), this.jobController.updateJob);
    this.router.get(`${this.path}/mostRecents`, authMiddleware(['freelancer']), this.jobController.getMostRecentJobs);
    this.router.get(`${this.path}/getUserJobBestMatches`, authMiddleware(['freelancer']), this.jobController.getUserJobBestMatches);

    this.router.get(`${this.path}/skills`, this.jobController.getAllSkills);
    this.router.get(`${this.path}/softSkills`, this.jobController.getAllSoftSkills);
    this.router.get(`${this.path}/skillsCategory`, this.jobController.getAllSkillsCategory);
    this.router.get(`${this.path}/savedJobs`, authMiddleware(['freelancer']), this.jobController.getUserSavedJobs);
    this.router.get(`${this.path}/getUserSavedItems`, authMiddleware(['freelancer']), this.jobController.getUserSavedItems);
    this.router.get(`${this.path}/client/:id`, authMiddleware(['freelancer', 'client']), this.jobController.getJobByClientId);
    this.router.get(`${this.path}/:id`, authMiddleware(['freelancer']), this.jobController.getJobById);
    this.router.post(`${this.path}/saveJob/:id`, authMiddleware(['freelancer']), this.jobController.savedJob);
    this.router.post(`${this.path}/unSaveJob/:id`, authMiddleware(['freelancer']), this.jobController.unSaveJob);
  }
}

export default JobRoute;
