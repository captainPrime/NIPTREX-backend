import { NextFunction, Request, Response } from 'express';

import BidService from '@/services/bid.service';
import UserService from '@/services/users.service';
import AboutService from '@/services/about.service';
import { HttpException } from '@/exceptions/HttpException';

class BidController {
  public bidService = new BidService();
  public userService = new UserService();
  public aboutService = new AboutService();

  /*
  |--------------------------------------------------------------------------
  | Bid Job
  |--------------------------------------------------------------------------
  */
  public bidJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const user: any = await this.userService.findUserById(req.user.id);
      const id: string = req.params.id;

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const bidJob = await this.bidService.getBidById(id);
      console.log('bid job user id', bidJob);
      if (bidJob && bidJob.user_id.toString() === req.user.id) throw new HttpException(400, 4002, 'JOB_ALREAD_BIDDED');

      const about = await this.aboutService.getUserAbout(req.user.id);
      if (about[0].nips < userData.bidding_amount) throw new HttpException(400, 4002, 'INSUFFICIENT_NIPS_TO_BID');

      const data = await this.bidService.bidJob({ ...userData, user_id: req.user.id, job_id: id });
      await this.aboutService.updateAboutById(req.user.id, { nips: about[0].nips - userData.bidding_amount });

      res.status(200).json({ status: 200, response_code: 4000, message: 'BID_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Bio By Id
  |--------------------------------------------------------------------------
  */
  public getTopBidders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.bidService.getTopBidders(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default BidController;
