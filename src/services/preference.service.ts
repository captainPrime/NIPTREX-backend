import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
import mongoose from 'mongoose';
import { Preference } from '@/models/profile.model';
import { IPreferences, IUpdatePreference } from '@/interfaces/profile.interface';
import { workPreferenceSchema } from '@/validations/profile.validation';

class PreferenceService {
  public preference: any = Preference;
  public userService = new UserService();

  /*
  |--------------------------------------------------------------------------
  | Create Preference
  |--------------------------------------------------------------------------
  */
  public async createPreference(body: IPreferences): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 2005, "You're not userData");

    const { error } = workPreferenceSchema.validate(body);

    if (error) throw new HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);

    const data: any = await this.preference.create(body);

    await this.userService.updateUser(data.user_id, { has_work_preference: true });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Preference
  |--------------------------------------------------------------------------
  */
  public async getUserPreference(userId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

    const data = await this.preference.find({ user_id: userId });
    if (!data) throw new HttpException(400, 2002, 'PREFERENCE_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Preference By Id
  |--------------------------------------------------------------------------
  */
  public async getPreferenceById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.preference.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'PREFERENCE_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Preference By Id
  |--------------------------------------------------------------------------
  */
  public async updatePreferenceById(id: mongoose.Types.ObjectId | string, body: IUpdatePreference): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.preference.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'PREFERENCE_NOT_FOUND');

    const updatedData = await this.preference.findByIdAndUpdate(data._id, body, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Preference
  |--------------------------------------------------------------------------
  */
  public async deletePreference(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.preference.findByIdAndDelete(id);
    if (!data) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return data;
  }
}

export default PreferenceService;
