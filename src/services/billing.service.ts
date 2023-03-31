import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
import mongoose from 'mongoose';
import { Billing } from '@/models/profile.model';
import { IBilling, IUpdateBilling } from '@/interfaces/profile.interface';
import { billingSchema } from '@/validations/profile.validation';

class BillingService {
  public billing: any = Billing;
  public userService = new UserService();

  /*
  |--------------------------------------------------------------------------
  | Create Billing
  |--------------------------------------------------------------------------
  */
  public async createBilling(body: IBilling): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 2005, "You're not userData");

    const { error } = billingSchema.validate(body);

    if (error) throw new HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);

    const data: any = await this.billing.create(body);

    await this.userService.updateUser(data.user_id, { has_billing: true });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Billing
  |--------------------------------------------------------------------------
  */
  public async getUserBilling(userId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

    const data = await this.billing.find({ user_id: userId });
    if (!data) throw new HttpException(400, 2002, 'BILLING_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Billing By Id
  |--------------------------------------------------------------------------
  */
  public async getBillingById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.billing.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'BILLING_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Billing By Id
  |--------------------------------------------------------------------------
  */
  public async updateBillingById(id: mongoose.Types.ObjectId | string, body: IUpdateBilling): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.billing.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'BILLING_NOT_FOUND');

    const updatedData = await this.billing.findByIdAndUpdate(data._id, body, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Billing
  |--------------------------------------------------------------------------
  */
  public async deleteBilling(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.billing.findByIdAndDelete(id);
    if (!data) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return data;
  }
}

export default BillingService;
