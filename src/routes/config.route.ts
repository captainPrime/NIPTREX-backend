import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import ConfigController from '@/controllers/config.controller';

class ConfigRoute implements Routes {
  public path = '/config';
  public router = Router();
  public configController = new ConfigController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.configController.createConfig);
    this.router.get(`${this.path}`, this.configController.getAllConfig);
    this.router.get(`${this.path}/getConfigById/:id`, this.configController.getConfigById);
    this.router.delete(`${this.path}/:id`, this.configController.deleteConfig);
    this.router.put(`${this.path}/:id`, this.configController.updateConfig);
  }
}

export default ConfigRoute;
