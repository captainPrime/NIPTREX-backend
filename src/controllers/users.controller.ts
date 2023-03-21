import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { IUserDoc, IUserModel } from '@interfaces/users.interface';
import userService from '@services/users.service';

class UsersController {
  public userService = new userService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: IUserModel[] = await this.userService.findAllUser();

      res.status(200).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: findAllUsersData });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: IUserModel = await this.userService.findUserById(userId);

      res.status(200).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: findOneUserData });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: IUserModel = await this.userService.createUser(userData);

      res.status(201).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: createUserData });
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user.id;
      const findOneUserData: IUserModel = await this.userService.findUserById(userId);

      res.status(200).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: findOneUserData });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: CreateUserDto = req.body;
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
