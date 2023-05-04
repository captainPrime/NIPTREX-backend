import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import RequestValidator from '@/middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getUsers);
    this.router.get(`${this.path}/getAllFreelancer`, authMiddleware(['client']), this.usersController.findAllFreelancer);
    this.router.get(`${this.path}/profile`, authMiddleware(['freelancer', 'client']), this.usersController.getProfile);
    this.router.get(`${this.path}/:id`, authMiddleware(['freelancer', 'client']), this.usersController.getUserById);
    this.router.post(`${this.path}`, RequestValidator.validate(CreateUserDto), this.usersController.createUser);
    this.router.put(`${this.path}/:id`, RequestValidator.validate(CreateUserDto), this.usersController.updateUser);
    this.router.delete(`${this.path}/:id`, this.usersController.deleteUser);
  }
}

export default UsersRoute;
