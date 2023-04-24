import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
import mongoose from 'mongoose';
import { Bio } from '@/models/profile.model';
import { IBio, IUpdateBio } from '@/interfaces/profile.interface';
import { bioSchemaUpdateValidation, bioSchemaValidation } from '@/validations/profile.validation';

class BioService {
  public bio: any = Bio;
  public userService = new UserService();

  /*
  |--------------------------------------------------------------------------
  | Create Bio
  |--------------------------------------------------------------------------
  */
  public async createBio(body: IBio): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 2005, "You're not userData");

    const { error } = bioSchemaValidation.validate(body);

    if (error) throw new HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);

    const data: any = await this.bio.create(body);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Bio
  |--------------------------------------------------------------------------
  */
  public async getUserBio(userId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

    const data = await this.bio.find({ user_id: userId });
    if (!data) throw new HttpException(400, 2002, 'BIO_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Bio By Id
  |--------------------------------------------------------------------------
  */
  public async getBioById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.bio.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'BIO_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Bio By Id
  |--------------------------------------------------------------------------
  */
  public async updateBioById(id: mongoose.Types.ObjectId | string, body: IUpdateBio): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const { error } = bioSchemaUpdateValidation.validate(body);

    if (error) throw new HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);

    const data = await this.bio.findOne({ user_id: id });
    if (!data) throw new HttpException(400, 2002, 'BIO_NOT_FOUND');

    const updatedData = await this.bio.findByIdAndUpdate(data._id, body, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Bio
  |--------------------------------------------------------------------------
  */
  public async deleteBio(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.bio.findByIdAndDelete(id);
    if (!data) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return data;
  }
}

export default BioService;
