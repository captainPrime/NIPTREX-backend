import { NextFunction, Request, Response } from 'express';

import BidService from '@/services/bid.service';
import JobService from '@/services/job.service';
import UserService from '@/services/users.service';
import AboutService from '@/services/about.service';
import { HttpException } from '@/exceptions/HttpException';
import { PaginationOptions } from '@/interfaces/job.inteface';

class BidController {
  public bidService = new BidService();
  public jobService = new JobService();
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
      const id: string = req.params.id;

      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const bidJob = await this.bidService.getBidByJob(id);
      if (bidJob && bidJob.user_id.toString() === user.id) throw new HttpException(400, 4002, 'JOB_ALREAD_BIDDED');

      const about = await this.aboutService.getUserAbout(user.id);
      if (about.nips < userData.bidding_amount) throw new HttpException(400, 4002, 'INSUFFICIENT_NIPS_TO_BID');

      const data = await this.bidService.bidJob({ ...userData, user_id: user.id, job_id: id });
      await this.aboutService.updateAboutById(user.id, { nips: about.nips - userData.bidding_amount });

      // update job
      await this.jobService.updateJobById(id, { activities: { proposals: +1 } });

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

  /*
  |--------------------------------------------------------------------------
  | Get Bio By Id
  |--------------------------------------------------------------------------
  */
  public getBidders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;

      const options: PaginationOptions = {
        sortBy: req.query.sortBy || 'status:desc,bidding_amount:desc',
        limit: parseInt(req.query.limit as string, 10) || 5,
        page: parseInt(req.query.page as string, 10) || 1,
        projectBy: req.query.projectBy || 'name:hide, role:hide',
      };

      const data = await this.bidService.getBidders(id, options);

      res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Like a proposal
  |--------------------------------------------------------------------------
  */
  public likeProposal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const proposalId: string = req.params.id;
      // const userId: string = req.user.id;

      const data = await this.bidService.likeProposal(proposalId);

      res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DisLike A Proposal
  |--------------------------------------------------------------------------
  */
  public dislikeProposal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const proposalId: string = req.params.id;
      // const userId: string = req.user.id;

      const data = await this.bidService.dislikeProposal(proposalId);

      res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Archive Proposal
  |--------------------------------------------------------------------------
  */
  public archiveProposal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const proposalId: string = req.params.id;

      const proposal = await this.bidService.getBidById(proposalId);
      if (!proposal) throw new HttpException(400, 2002, 'PROPOSAL_NOT_FOUND');

      const archive = await this.bidService.getArchiveProposalById(proposal._id.toString());
      if (archive) throw new HttpException(400, 5002, 'PROPOSAL_ALREAD_ARCHIVED');

      const payload = {
        user_id: proposal.user_id,
        client_id: req.user.id,
        proposal: proposal._id.toString(),
      };

      const data = await this.bidService.archiveProposal(payload);

      res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | getUserArchivedProposals
  |--------------------------------------------------------------------------
  */
  public getUserArchivedProposals = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.bidService.getUserArchivedProposals(req.user.id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Archive Proposal
  |--------------------------------------------------------------------------
  */
  public shortlistProposal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const proposalId: string = req.params.id;

      const proposal = await this.bidService.getBidById(proposalId);
      if (!proposal) throw new HttpException(400, 2002, 'PROPOSAL_NOT_FOUND');

      const archive = await this.bidService.getShortListById(proposal._id.toString());
      if (archive) throw new HttpException(400, 5002, 'PROPOSAL_ALREADY_SHORTLISTED');

      const payload = {
        user_id: proposal.user_id,
        client_id: req.user.id,
        proposal: proposal._id.toString(),
      };

      const data = await this.bidService.shortListProposal(payload);

      res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | getUserArchivedProposals
  |--------------------------------------------------------------------------
  */
  public getUserShortlistProposals = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.bidService.getUserShortLists(req.user.id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default BidController;
