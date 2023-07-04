import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import ServiceController from '@/controllers/service.controller';
import authMiddleware from '@/middlewares/auth.middleware';

class ServiceRoute implements Routes {
  public path = '/service';
  public router = Router();
  public serviceController = new ServiceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware(['freelancer']), this.serviceController.createService);
    this.router.get(`${this.path}/getServiceById/:id`, this.serviceController.getServiceById);
    this.router.get(`${this.path}/getServiceByUserId/:id`, this.serviceController.getServiceByUserId);
    this.router.get(`${this.path}/getUserService`, authMiddleware(['freelancer']), this.serviceController.getUserService);
    this.router.get(`${this.path}`, this.serviceController.getAllServices);
    this.router.put(`${this.path}/updateServiceById/:id`, authMiddleware(['freelancer']), this.serviceController.updateServiceById);
    this.router.delete(`${this.path}/deleteService/:id`, authMiddleware(['freelancer']), this.serviceController.deleteService);
    this.router.post(`${this.path}/hireFreelancerService/:id`, authMiddleware(['client']), this.serviceController.hireFreelancerService);
  }
}

export default ServiceRoute;
