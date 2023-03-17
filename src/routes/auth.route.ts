import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import RequestValidator from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}register`, RequestValidator.validate(CreateUserDto, 'body'), this.authController.register);
    this.router.post(`${this.path}login`, this.authController.logIn);
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);
    this.router.post(`${this.path}refresh-tokens`, authMiddleware, this.authController.refreshTokens);
    this.router.post(`${this.path}forgot-password`, authMiddleware, this.authController.forgotPassword);
    this.router.post(`${this.path}reset-password`, authMiddleware, this.authController.resetPassword);
    this.router.post(`${this.path}send-verification-email`, this.authController.sendVerificationEmail);
    this.router.post(`${this.path}verify-email`, this.authController.verifyEmail);
  }
}

export default AuthRoute;
