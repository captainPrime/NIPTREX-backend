import mongoose from 'mongoose';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
import { HttpException } from '@exceptions/HttpException';
import { BiddingModel, IBidding } from '@/models/bid.model';
import { biddingSchemaValidation } from '@/validations/bid.validation';
import { PaginationOptions } from '@/interfaces/job.inteface';
import { About } from '@/models/profile.model';
import AboutService from './about.service';

class BidService {
  public bid: any = BiddingModel;
  public aboutService = new AboutService();
  public userService = new UserService();

  /*
  |--------------------------------------------------------------------------
  | Bid Job
  |--------------------------------------------------------------------------
  */
  public async bidJob(body: IBidding): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 2005, 'All required fields cannot be empty');

    const { error } = biddingSchemaValidation.validate(body);

    if (error) throw new HttpException(400, 4002, 'BID_VALIDATION_ERROR', [error.details[0].message]);

    const data: any = await this.bid.create(body);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | getTopBidders
  |--------------------------------------------------------------------------
  */
  public async getTopBidders(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 4004, 'id can not be empty');

    const data = await this.bid.find({ job_id: id }).sort({ bidding_amount: -1 }).limit(10).populate('user_id');
    if (!data) throw new HttpException(400, 4003, 'BIDDERS_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | getTopBidders
  |--------------------------------------------------------------------------
  */
  public async getBidders(id: mongoose.Types.ObjectId | string, options: PaginationOptions): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 4004, 'id can not be empty');

    const data = await this.bid.paginate({ job_id: id }, options);

    if (!data) throw new HttpException(400, 4003, 'BIDDERS_NOT_FOUND');

    const results = await Promise.all(
      data.results.map(async (job: any) => {
        console.log('ID', job);
        const about = await this.aboutService.getUserAbout(job.user_id.toString());
        return { job, about };
      }),
    );

    return { ...data, results };
  }

  /*
  |--------------------------------------------------------------------------
  | Get Bid By Id
  |--------------------------------------------------------------------------
  */
  public async getBidById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.bid.findOne({ job_id: id });
    // if (!data) throw new HttpException(400, 2002, 'BID_NOT_FOUND');

    return data;
  }
}

export default BidService;
