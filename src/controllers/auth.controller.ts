/* eslint-disable security/detect-possible-timing-attacks */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@services/auth.service';
import { asyncWrapper } from '@/utils/asyncWrapper';
import TokenService from '@/modules/token/token.service';
import EmailService from '@/modules/email/email.service';
import UserService from '@/services/users.service';
import ApiError from '@/exceptions/ApiError';

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

    res.send({ status: 201, message: 'user created successfully', data: signUpUserData });
  });

  public logIn = asyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await this.authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await this.tokenService.generateAuthTokens(user);
    res.send({ status: 200, message: 'user login successful', data: tokens });
  });

  public logOut = asyncWrapper(async (req: RequestWithUser, res: Response) => {
    await this.authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  public forgotPassword = asyncWrapper(async (req: Request, res: Response) => {
    const resetPasswordToken = await this.tokenService.generateResetPasswordToken(req.body.email);
    await this.emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(200).send({ status: 200, message: 'Reset password email sent' });
  });

  public resetPassword = asyncWrapper(async (req: Request, res: Response) => {
    const { password, confirm_password } = req.body;
    if (confirm_password !== password) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'password mismatch');
    }
    await this.authService.resetPassword(req.query['token'], password);
    res.status(200).send({ success: true, message: 'Password Reset successfully' });
  });

  public sendVerificationEmail = asyncWrapper(async (req: Request, res: Response) => {
    const user = await this.userService.findUserByEmail(req.body.email);
    const verifyEmailToken = await this.tokenService.generateVerifyEmailToken(user.id);
    await this.emailService.sendVerificationEmail(user.email, verifyEmailToken, user.first_name);
    res.status(200).send({ status: 200, message: 'Verification email sent' });
  });

  public verifyEmail = asyncWrapper(async (req: Request, res: Response) => {
    await this.authService.verifyEmail(req.query.token);
    res.status(200).send({ success: true, message: 'Verified email successfully' });
  });

  public refreshTokens = asyncWrapper(async (req: Request, res: Response) => {
    const userWithTokens = await this.authService.refreshAuth(req.body.refreshToken);
    res.send({ ...userWithTokens });
  });
}

export default AuthController;
