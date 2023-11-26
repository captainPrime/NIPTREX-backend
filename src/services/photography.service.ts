import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
import mongoose from 'mongoose';
import { IPhotography, Photography } from '@/models/photography.model';
import { photographySchemaValidation, photographyUpdateValidation } from '@/validations/photography.validation';
import { PaginationOptions } from '@/interfaces/job.inteface';

class PhotographyService {
  public photography: any = Photography;
  public userService = new UserService();

  /*
  |--------------------------------------------------------------------------
  | Create New Photography
  |--------------------------------------------------------------------------
  */
  public async createPhotography(body: IPhotography | any): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 9005, 'All required fields cannot be empty');
    const data: any = await this.photography.create(body);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Photography
  |--------------------------------------------------------------------------
  */
  public async getUserPhotography(options: PaginationOptions, filter: any): Promise<any> {
    // if (isEmpty(userId)) throw new HttpException(400, 9001, 'User id can not be empty');

    const data = await this.photography.paginate(filter, options);
    if (!data) throw new HttpException(400, 9003, 'PHOTOGRAPHY_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Photography
  |--------------------------------------------------------------------------
  */
  public async getAllPhotography(filter: any, options: PaginationOptions): Promise<any> {
    const data = await this.photography.paginate(filter, options);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Photography By Id
  |--------------------------------------------------------------------------
  */
  public async getPhotographyById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 9001, 'id can not be empty');

    const data = await this.photography.findOne({ _id: id }).populate({
      path: 'user_id',
      select: 'id first_name last_name email phone_number country createdAt', // fields to be returned from the referenced document
      options: {
        lean: true, // return plain JS objects instead of Mongoose documents
      },
      as: 'user', // the name of the key to populate, defaults to the path
    });
    if (!data) throw new HttpException(400, 9003, 'PHOTOGRAPHY_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Bio By Id
  |--------------------------------------------------------------------------
  */
  //   public async updatePhotography(id: mongoose.Types.ObjectId | string, body: IUpdateBio): Promise<any> {
  //     if (isEmpty(id)) throw new HttpException(400, 9001, 'id can not be empty');

  //     const { error } = photographyUpdateValidation.validate(body);

  //     if (error) throw new HttpException(400, 9002, 'BILLING_ADDRESS_VALIDATION_ERROR', [error.details[0].message]);

  //     const data = await this.photography.findOne({ user_id: id });
  //     if (!data) throw new HttpException(400, 9003, 'BILLING_ADDRESS_NOT_FOUND');

  //     const updatedData = await this.photography.findByIdAndUpdate(data._id, body, {
  //       new: true,
  //     });

  //     if (!updatedData) throw new HttpException(400, 9009, 'BILLING_ADDRESS_REQUEST_ERROR');

  //     return updatedData;
  //   }

  /*
  |--------------------------------------------------------------------------
  | Delete Photography
  |--------------------------------------------------------------------------
  */
  public async deletePhotography(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.photography.findByIdAndDelete(id);
    if (!data) throw new HttpException(400, 9009, 'PHOTOGRAPHY_REQUEST_ERROR');

    return data;
  }
}

export default PhotographyService;
