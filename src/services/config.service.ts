import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
import mongoose from 'mongoose';
import { Config, IConfig, IUpdateConfig } from '@/models/config.model';
import { configSchemaValidation, configUpdateValidation } from '@/validations/config.validation';

class ConfigService {
  public config: any = Config;
  public userService = new UserService();

  /*
  |--------------------------------------------------------------------------
  | Create Config
  |--------------------------------------------------------------------------
  */
  public async createConfig(body: IConfig): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 2005, "You're not userData");

    const { error } = configSchemaValidation.validate(body);

    if (error) throw new HttpException(400, 9002, 'CONFIG_VALIDATION_ERROR', [error.details[0].message]);

    const data: any = await this.config.create(body);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Config
  |--------------------------------------------------------------------------
  */
  public async getAllConfig(): Promise<any> {
    const data = await this.config.find({});
    if (!data) throw new HttpException(400, 2002, 'CONFIG_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Config By Id
  |--------------------------------------------------------------------------
  */
  public async getConfigById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.config.findOne({ _id: id });
    if (!data) throw new HttpException(400, 9004, 'CONFIG_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Config By Id
  |--------------------------------------------------------------------------
  */
  public async updateConfigById(id: mongoose.Types.ObjectId | string, body: IUpdateConfig): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 9001, 'id can not be empty');

    const { error } = configUpdateValidation.validate(body);

    if (error) throw new HttpException(400, 9002, 'CONFIG_VALIDATION_ERROR', [error.details[0].message]);

    const data = await this.config.findOne({ _id: id });
    if (!data) throw new HttpException(400, 9004, 'CONFIG_NOT_FOUND');

    const updatedData = await this.config.findByIdAndUpdate(data._id, body, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 9009, 'CONFIG_REQUEST_ERROR');

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Config
  |--------------------------------------------------------------------------
  */
  public async deleteConfig(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.config.findByIdAndDelete(id);
    if (!data) throw new HttpException(400, 9009, 'CONFIG_REQUEST_ERROR');

    return data;
  }
}

export default ConfigService;
