import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { IUser } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { asyncWrapper } from '@/utils/asyncWrapper';
import TokenService from '@/modules/token/token.service';
import EmailService from '@/modules/email/email.service';

class AuthController {
  public authService = new AuthService();
  public tokenService = new TokenService();
  public emailService = new EmailService();

  public signUp = asyncWrapper(async (req: Request, res: Response) => {
    const userData: CreateUserDto = req.body;
    const signUpUserData: IUser = await this.authService.signup(userData);

    const verifyEmailToken = await this.tokenService.generateVerifyEmailToken(req.user);
    await this.emailService.sendVerificationEmail(signUpUserData.email, verifyEmailToken, signUpUserData.first_name);

    res.status(201).json({ data: signUpUserData, message: 'signup' });
  });

  public logIn = asyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await this.authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await this.tokenService.generateAuthTokens(user);
    res.send({ user, tokens });
  });

  public logOut = asyncWrapper(async (req: RequestWithUser, res: Response) => {
    await this.authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  public forgotPassword = asyncWrapper(async (req: Request, res: Response) => {
    const resetPasswordToken = await this.tokenService.generateResetPasswordToken(req.body.email);
    await this.emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  public resetPassword = asyncWrapper(async (req: Request, res: Response) => {
    await this.authService.resetPassword(req.query['token'], req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
  });

  public sendVerificationEmail = asyncWrapper(async (req: Request, res: Response) => {
    const verifyEmailToken = await this.tokenService.generateVerifyEmailToken(req.user);
    await this.emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.user.name);
    res.status(httpStatus.NO_CONTENT).send();
  });

  public verifyEmail = asyncWrapper(async (req: Request, res: Response) => {
    await this.authService.verifyEmail(req.query['token']);
    res.status(httpStatus.NO_CONTENT).send();
  });

  public refreshTokens = asyncWrapper(async (req: Request, res: Response) => {
    const userWithTokens = await this.authService.refreshAuth(req.body.refreshToken);
    res.send({ ...userWithTokens });
  });
}

export default AuthController;
