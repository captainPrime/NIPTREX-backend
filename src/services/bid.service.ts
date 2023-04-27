import mongoose from 'mongoose';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
import { HttpException } from '@exceptions/HttpException';
import { BiddingModel, IBidding } from '@/models/bid.model';
import { biddingSchemaValidation } from '@/validations/bid.validation';
import AboutService from './about.service';

class BidService {
  public bid: any = BiddingModel;
  public userService = new UserService();
  public aboutService = new AboutService();

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

    const about = await this.aboutService.getUserAbout(data.user_id);
    await this.aboutService.updateAboutById(data.user_id, { nips: about.nips - body.bidding_amount });

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
