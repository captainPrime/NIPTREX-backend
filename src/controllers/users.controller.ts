import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { IUser, IUserDoc, IUserModel, UpdateUserBody } from '@interfaces/users.interface';
import userService from '@services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import AboutService from '@/services/about.service';

class UsersController {
  public userService = new userService();
  public aboutService = new AboutService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: IUserModel[] = await this.userService.findAllUser();

      res.status(200).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: findAllUsersData });
    } catch (error) {
      next(error);
    }
  };

  public findAllFreelancer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: any[] = await this.userService.findAllFreelancer(req.query);

      res.status(200).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: findAllUsersData });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: IUser | null = await this.userService.findUserById(userId);

      res.status(200).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: findOneUserData });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: IUserModel = await this.userService.createUser(userData);

      if (userData.referral_code) {
        const referredUser = await this.userService.findUserByReferralCode(userData.referral_code);
        if (!referredUser) throw new HttpException(400, 2004, 'USER_NOT_FOUND');

        await this.aboutService.updateAboutById(referredUser.id, { nips: +10 });
      }

      res.status(201).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: createUserData });
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user.id;
      const findOneUserData: IUser | null = await this.userService.findUserById(userId);

      res.status(200).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: findOneUserData });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: UpdateUserBody = req.body;
      const updateUserData: IUserDoc = await this.userService.updateUser(userId, userData);

      res.status(200).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: updateUserData });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: IUserModel = await this.userService.deleteUser(userId);

      res.status(200).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: deleteUserData });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
