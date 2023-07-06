import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
import mongoose from 'mongoose';
import { BankInfo } from '@/models/profile.model';
import { IBankInfo, IUpdateBio } from '@/interfaces/profile.interface';
import { bankInfoSchemaValidation, bioSchemaUpdateValidation } from '@/validations/profile.validation';

class BankService {
  public bank: any = BankInfo;
  public userService = new UserService();

  /*
  |--------------------------------------------------------------------------
  | Add bank Info
  |--------------------------------------------------------------------------
  */
  public async addBankInfo(body: IBankInfo): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 9005, 'All required fields cannot be empty');

    const { error } = bankInfoSchemaValidation.validate(body);

    if (error) throw new HttpException(400, 9002, 'BANK_VALIDATION_ERROR', [error.details[0].message]);

    const data: any = await this.bank.create(body);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Bank
  |--------------------------------------------------------------------------
  */
  public async getUserBank(userId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 9001, 'User id can not be empty');

    const data = await this.bank.find({ user_id: userId });
    if (!data) throw new HttpException(400, 9003, 'BANK_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Bank By Id
  |--------------------------------------------------------------------------
  */
  public async getBankById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 9001, 'id can not be empty');

    const data = await this.bank.findOne({ _id: id });
    if (!data) throw new HttpException(400, 9003, 'BANK_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Bio By Id
  |--------------------------------------------------------------------------
  */
  public async bankInfoSchemaUpdateValidation(id: mongoose.Types.ObjectId | string, body: IUpdateBio): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 9001, 'id can not be empty');

    const { error } = bioSchemaUpdateValidation.validate(body);

    if (error) throw new HttpException(400, 9002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);

    const data = await this.bank.findOne({ user_id: id });
    if (!data) throw new HttpException(400, 9003, 'BANK_NOT_FOUND');

    const updatedData = await this.bank.findByIdAndUpdate(data._id, body, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 9009, 'PROFILE_REQUEST_ERROR');

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Bank
  |--------------------------------------------------------------------------
  */
  public async deleteBank(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.bank.findByIdAndDelete(id);
    if (!data) throw new HttpException(400, 9009, 'BANK_REQUEST_ERROR');

    return data;
  }
}

export default BankService;
