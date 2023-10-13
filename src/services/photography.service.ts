import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
import mongoose from 'mongoose';
import { BillingAddress } from '@/models/profile.model';
import { IBillingAddress, IUpdateBio } from '@/interfaces/profile.interface';
import { billingAddressUpdateValidation, billingAddressSchemaValidation } from '@/validations/profile.validation';
import { Photography } from '@/models/photography.model';

class PhotographyService {
  public photography: any = Photography;
  public userService = new UserService();

  /*
  |--------------------------------------------------------------------------
  | Add bank Info
  |--------------------------------------------------------------------------
  */
  public async addPhotography(body: IBillingAddress): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 9005, 'All required fields cannot be empty');

    const { error } = billingAddressSchemaValidation.validate(body);

    if (error) throw new HttpException(400, 9002, 'BILLING_ADDRESS_VALIDATION_ERROR', [error.details[0].message]);

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
    if (!data) throw new HttpException(400, 9003, 'BILLING_ADDRESS_NOT_FOUND');

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
    if (!data) throw new HttpException(400, 9003, 'BILLING_ADDRESS_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Bio By Id
  |--------------------------------------------------------------------------
  */
  public async updateBankInfo(id: mongoose.Types.ObjectId | string, body: IUpdateBio): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 9001, 'id can not be empty');

    const { error } = billingAddressUpdateValidation.validate(body);

    if (error) throw new HttpException(400, 9002, 'BILLING_ADDRESS_VALIDATION_ERROR', [error.details[0].message]);

    const data = await this.bank.findOne({ user_id: id });
    if (!data) throw new HttpException(400, 9003, 'BILLING_ADDRESS_NOT_FOUND');

    const updatedData = await this.bank.findByIdAndUpdate(data._id, body, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 9009, 'BILLING_ADDRESS_REQUEST_ERROR');

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
    if (!data) throw new HttpException(400, 9009, 'BILLING_ADDRESS_REQUEST_ERROR');

    return data;
  }
}

export default PhotographyService;
