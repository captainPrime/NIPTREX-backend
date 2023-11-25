import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import ConfigService from '@/services/config.service';
import { IUpdateConfig } from '@/models/config.model';

class ConfigController {
  public userService = new UserService();
  public configServicee = new ConfigService();

  /*
  |--------------------------------------------------------------------------
  | Create Config
  |--------------------------------------------------------------------------
  */
  public createConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      //   const user: any = await this.userService.findUserById(req.user.id);

      //   if (!user.verified) {
      //     throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      //   }

      //   const config = await this.configService.getUserConfig(req.user.id);
      //   if (config.length !== 0) throw new HttpException(400, 5002, 'WORK_Config_ALREAD_ADDED');

      const data = await this.configService.createConfig(userData);

      res.status(200).json({ status: 200, response_code: 9000, message: 'CONFIG_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get User Config
  |--------------------------------------------------------------------------
  */
  public getAllConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const data = await this.configService.getAllConfig(req.user.id);

      res.status(200).json({ status: 200, response_code: 9000, message: 'CONFIG_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Config By Id
  |--------------------------------------------------------------------------
  */
  public getConfigById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.configService.getConfigById(id);

      res.status(200).json({ status: 200, response_code: 9000, message: 'CONFIG_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update Config
  |--------------------------------------------------------------------------
  */
  public updateConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IUpdateConfig = req.body;
      const data = await this.configService.updateConfigById(req.params.id, body);

      res.status(200).json({ status: 200, response_code: 9000, message: 'CONFIG_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Config
  |--------------------------------------------------------------------------
  */
  public deleteConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.configService.deleteConfig(id);

      res.status(200).json({ status: 200, response_code: 9000, message: 'CONFIG_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default ConfigController;
