import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { CreateUserDto, UserLoginDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { IUser } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, _next: NextFunction) => {
    const userData: CreateUserDto = req.body;
    const signUpUserData: IUser = await this.authService.signup(userData);

    res.status(201).json({ data: signUpUserData, message: 'signup' });
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: UserLoginDto = req.body;
      const { cookie, user } = await this.authService.loginUserWithEmailAndPassword(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.send({ user, token: cookie });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: IUser = req.user;
      const logOutUserData: IUser = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
