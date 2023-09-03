/* eslint-disable security/detect-possible-timing-attacks */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { CreateUserDto, ResetPasswordDto, UserLoginDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@services/auth.service';
import { asyncWrapper } from '@/utils/asyncWrapper';
import TokenService from '@/modules/token/token.service';
import EmailService from '@/modules/email/email.service';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import passport from '@/middlewares/passport.middleware';

class AuthController {
  public authService = new AuthService();
  public tokenService = new TokenService();
  public userService = new UserService();
  public emailService = new EmailService();

  public register = asyncWrapper(async (req: Request, res: Response) => {
    const userData: CreateUserDto = req.body;
    const signUpUserData = await this.authService.signup(userData);

    const verifyEmailToken = await this.tokenService.generateVerifyEmailToken(signUpUserData._id);
    await this.emailService.sendVerificationEmail(signUpUserData.email, verifyEmailToken, signUpUserData.first_name);

    res.send({ status: 200, response_code: 1000, message: 'AUTH_REQUEST_SUCCESSFUL', data: signUpUserData });
  });

  public logIn = asyncWrapper(async (req: Request, res: Response) => {
    const userLogindata: UserLoginDto = req.body;
    const user = await this.authService.loginUserWithEmailAndPassword(userLogindata.email, userLogindata.password);
    const tokens = await this.tokenService.generateAuthTokens(user);
    res.send({ status: 200, response_code: 1000, message: 'AUTH_REQUEST_SUCCESSFUL', data: tokens });
  });

  public googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

  public googleCallback = passport.authenticate('google', {
    failureRedirect: '/login', // Redirect to login page on failure
    session: false, // Disable session management for this route
  });

  // Handle the redirect after successful Google login
  public googleLoginRedirect = (req: RequestWithUser, res: Response) => {
    // You can redirect the user to a success page or perform any desired action here.
    res.redirect('https://facebook.com');
  };

  public logOut = asyncWrapper(async (req: RequestWithUser, res: Response) => {
    await this.authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  public forgotPassword = asyncWrapper(async (req: Request, res: Response) => {
    const resetPasswordToken = await this.tokenService.generateResetPasswordToken(req.body.email);
    await this.emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(200).send({ status: 200, response_code: 1000, message: 'AUTH_REQUEST_SUCCESSFUL', data: [] });
  });

  public resetPassword = asyncWrapper(async (req: Request, res: Response) => {
    const passwordData: ResetPasswordDto = req.body;
    if (passwordData.confirm_password !== passwordData.password) {
      throw new HttpException(400, 1020, 'password mismatch');
    }
    await this.authService.resetPassword(req.query['token'], passwordData.password);
    res.status(200).send({ status: 200, response_code: 1000, message: 'AUTH_REQUEST_SUCCESSFUL', data: [] });
  });

  public sendVerificationEmail = asyncWrapper(async (req: Request, res: Response) => {
    const user = await this.userService.findUserByEmail(req.body.email);
    const verifyEmailToken = await this.tokenService.generateVerifyEmailToken(user?.id);
    await this.emailService.sendVerificationEmail(user?.email, verifyEmailToken, user?.first_name);
    res.status(200).send({ status: 200, response_code: 1000, message: 'AUTH_REQUEST_SUCCESSFUL', data: [] });
  });

  public verifyEmail = asyncWrapper(async (req: Request, res: Response) => {
    await this.authService.verifyEmail(req.query.token);
    res.status(200).send({ status: 200, response_code: 1000, message: 'AUTH_REQUEST_SUCCESSFUL', data: [] });
  });

  public refreshTokens = asyncWrapper(async (req: Request, res: Response) => {
    const userWithTokens = await this.authService.refreshAuth(req.body.refreshToken);
    res.send({ ...userWithTokens });
  });
}

export default AuthController;
