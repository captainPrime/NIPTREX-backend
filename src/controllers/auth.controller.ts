import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { CreateUserDto, UserLoginDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { IUser } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { asyncWrapper } from '@/utils/asyncWrapper';
import { emailService } from '@/modules/email';

class AuthController {
  public authService = new AuthService();

  public signUp = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const userData: CreateUserDto = req.body;
    const signUpUserData: IUser = await this.authService.signup(userData);

    res.status(201).json({ data: signUpUserData, message: 'signup' });
  });

  public logIn = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: UserLoginDto = req.body;
      const { cookie, user } = await this.authService.loginUserWithEmailAndPassword(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.send({ user, token: cookie });
    } catch (error) {
      next(error);
    }
  });

  public logOut = asyncWrapper(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: IUser = req.user;
      const logOutUserData: IUser = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  });

  public forgotPassword = asyncWrapper(async (req: Request, res: Response) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  public resetPassword = asyncWrapper(async (req: Request, res: Response) => {
    await this.authService.resetPassword(req.query['token'], req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
  });

  public sendVerificationEmail = asyncWrapper(async (req: Request, res: Response) => {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.user.name);
    res.status(httpStatus.NO_CONTENT).send();
  });

  public verifyEmail = asyncWrapper(async (req: Request, res: Response) => {
    await this.authService.verifyEmail(req.query['token']);
    res.status(httpStatus.NO_CONTENT).send();
  });
}

export default AuthController;
