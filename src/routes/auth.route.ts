import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto, ResetPasswordDto, UserLoginDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import RequestValidator from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, RequestValidator.validate(CreateUserDto), this.authController.register);
    this.router.post(`${this.path}/login`, RequestValidator.validate(UserLoginDto), this.authController.logIn);
    this.router.post(`${this.path}/logout`, authMiddleware, this.authController.logOut);
    this.router.post(`${this.path}/refresh_tokens`, authMiddleware, this.authController.refreshTokens);
    this.router.post(`${this.path}/forgot_password`, this.authController.forgotPassword);
    this.router.post(`${this.path}/reset_password`, RequestValidator.validate(ResetPasswordDto), this.authController.resetPassword);
    this.router.post(`${this.path}/send_verification_email`, this.authController.sendVerificationEmail);
    this.router.post(`${this.path}/verify_email`, this.authController.verifyEmail);
  }
}

export default AuthRoute;
