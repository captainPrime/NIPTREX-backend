import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
import mongoose from 'mongoose';
import { Identity } from '@/models/profile.model';
import { IDocument, IUpdateDocument } from '@/interfaces/profile.interface';
import { identitySchema, identityUpdateSchema } from '@/validations/profile.validation';

class IdentityService {
  public identity: any = Identity;
  public userService = new UserService();

  /*
  |--------------------------------------------------------------------------
  | Create Identity
  |--------------------------------------------------------------------------
  */
  public async createIdentity(body: IDocument): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 2005, "You're not userData");

    const { error } = identitySchema.validate(body);

    if (error) throw new HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);

    const data: any = await this.identity.create(body);

    await this.userService.updateUser(data.user_id, { has_identity: true });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Identity
  |--------------------------------------------------------------------------
  */
  public async getUserIdentity(userId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

    const data = await this.identity.find({ user_id: userId });
    if (!data) throw new HttpException(400, 2002, 'IDENTITY_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Identity By Id
  |--------------------------------------------------------------------------
  */
  public async getIdentityById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.identity.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'IDENTITY_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Identity By Id
  |--------------------------------------------------------------------------
  */
  public async updateIdentityById(id: mongoose.Types.ObjectId | string, body: IUpdateDocument): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const { error } = identityUpdateSchema.validate(body);

    if (error) throw new HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);

    const data = await this.identity.findOne({ user_id: id });
    if (!data) throw new HttpException(400, 2002, 'IDENTITY_NOT_FOUND');

    const updatedData = await this.identity.findByIdAndUpdate(data._id, body, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Identity
  |--------------------------------------------------------------------------
  */
  public async deleteIdentity(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.identity.findByIdAndDelete(id);
    if (!data) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return data;
  }
}

export default IdentityService;
