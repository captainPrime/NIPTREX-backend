import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import JobController from '@/controllers/job.controller';

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
    this.router.get(`${this.path}/getUserJobBestMatches`, authMiddleware, this.jobController.getUserJobBestMatches);

    this.router.get(`${this.path}/savedJobs`, authMiddleware, this.jobController.getUserSavedJobs);
    this.router.get(`${this.path}/:id`, authMiddleware, this.jobController.getJobById);
    this.router.post(`${this.path}/saveJob/:id`, authMiddleware, this.jobController.savedJob);
  }
}

export default JobRoute;
