import mongoose from 'mongoose';
import { isEmpty } from '@utils/util';
import { HttpException } from '@exceptions/HttpException';
import { IRating, RatingModel } from '@/models/rating.model';
import { PaginationOptions } from '@/interfaces/job.inteface';
import { ratingValidationSchema, ratingUpdateValidationSchema } from '@/validations/rating.validation';

class RatingService {
  public rating: any = RatingModel;

  /*
  |--------------------------------------------------------------------------
  | Create Rating
  |--------------------------------------------------------------------------
  */
  public async rateEntity(body: IRating): Promise<IRating> {
    if (isEmpty(body)) throw new HttpException(400, 8001, 'All required fields cannot be empty');

    const { error } = ratingValidationSchema.validate(body);

    if (error) throw new HttpException(400, 8001, 'RATING_VALIDATION_ERROR', [error.details[0].message]);

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
    if (isEmpty(id)) throw new HttpException(400, 8001, 'ID cannot be empty');

    const data: IRating | null = await this.rating.findOne({ _id: id });
    if (!data) throw new HttpException(400, 8002, 'RATING_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Rating by ID
  |--------------------------------------------------------------------------
  */
  public async getRatingByUserId(id: mongoose.Types.ObjectId | string): Promise<IRating[] | null> {
    if (isEmpty(id)) throw new HttpException(400, 8001, 'ID cannot be empty');

    const data: IRating[] | null = await this.rating.find({ entity: id });
    if (!data) throw new HttpException(400, 8002, 'RATING_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | un Rating by ID
  |--------------------------------------------------------------------------
  */
  public async unRateEntity(id: mongoose.Types.ObjectId | string, body: Partial<IRating>): Promise<IRating> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'ID cannot be empty');

    const { error } = ratingUpdateValidationSchema.validate(body);

    if (error) throw new HttpException(400, 2002, 'SERVICE_VALIDATION_ERROR', [error.details[0].message]);

    const data: IRating | null = await this.rating.findByIdAndDelete(id);
    if (!data) throw new HttpException(400, 2009, 'RATING_REQUEST_ERROR');

    const updatedData: IRating | null = await this.rating.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 2009, 'RATING_REQUEST_ERROR');

    return updatedData;
  }
}

export default RatingService;
