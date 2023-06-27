import { PaginationOptions } from '@/interfaces/job.inteface';
import { IRating, RatingModel } from '@/models/rating.model';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import mongoose from 'mongoose';

class ServiceService {
  public rating: any = RatingModel;

  /*
  |--------------------------------------------------------------------------
  | Create Rating
  |--------------------------------------------------------------------------
  */
  public async rateEntity(body: IRating): Promise<IRating> {
    if (isEmpty(body)) throw new HttpException(400, 2005, 'All required fields cannot be empty');

    const { error } = serviceValidationSchema.validate(body);

    if (error) throw new HttpException(400, 2002, 'RATING_VALIDATION_ERROR', [error.details[0].message]);

    const data: IRating = await this.rating.create(body);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Rating
  |--------------------------------------------------------------------------
  */
  public async getAllRating(filter: any, options: PaginationOptions): Promise<any[]> {
    const data = await this.rating.paginate(filter, options);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Rating by ID
  |--------------------------------------------------------------------------
  */
  public async getRatingById(id: mongoose.Types.ObjectId | string): Promise<IRating> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'ID cannot be empty');

    const data: IRating | null = await this.rating.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'RATING_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Rating by ID
  |--------------------------------------------------------------------------
  */
  public async getRatingByUserId(id: mongoose.Types.ObjectId | string): Promise<IRating[] | null> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'ID cannot be empty');

    const data: IRating[] | null = await this.rating.find({ user_id: id });
    if (!data) throw new HttpException(400, 2002, 'RATING_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Service by ID
  |--------------------------------------------------------------------------
  */
  public async deleteService(id: mongoose.Types.ObjectId | string): Promise<IService> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'ID cannot be empty');

    const data: IService | null = await this.service.findByIdAndDelete(id);
    if (!data) throw new HttpException(400, 2009, 'SERVICE_REQUEST_ERROR');

    return data;
  }
}

export default ServiceService;
