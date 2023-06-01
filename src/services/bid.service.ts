/* eslint-disable security/detect-object-injection */
import mongoose from 'mongoose';
import { isEmpty } from '@utils/util';
import JobService from './job.service';
import UserService from './users.service';
import AboutService from './about.service';
import { HttpException } from '@exceptions/HttpException';
import { PaginationOptions } from '@/interfaces/job.inteface';
import { calculateMatchPercentage } from '@/utils/matchPercentage';
import { biddingSchemaValidation, updateBiddingSchemaValidation, updateMilestoneStageSchema } from '@/validations/bid.validation';
import { ArchiveProposalModel, BiddingModel, BiddingStage, IBidding, IUpdateBidding, ShortListProposalModel } from '@/models/bid.model';
import EmailService from '@/modules/email/email.service';

class BidService {
  public bid: any = BiddingModel;
  public archive: any = ArchiveProposalModel;
  public shortlist: any = ShortListProposalModel;
  public jobService = new JobService();
  public userService = new UserService();
  public aboutService = new AboutService();
  public emailService = new EmailService();

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
  | Create Job
  |--------------------------------------------------------------------------
  */
  public async updateBid(selector: string, job_id: string, body: IUpdateBidding): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 2005, 'Request body cannot be empty');

    const { error } = updateBiddingSchemaValidation.validate(body);
    if (error) throw new HttpException(400, 2002, 'BID_VALIDATION_ERROR', [error.details[0].message]);

    const data = await this.bid.findOne({ user_id: selector, job_id });
    if (!data) throw new HttpException(400, 2002, 'BID_NOT_FOUND');

    const updatedPayload: IUpdateBidding = {
      ...data.toObject(),
      ...body,
    };

    if (body.milestone_stage) {
      updatedPayload.milestone_stage = body.milestone_stage.map((milestone, index) => ({
        ...data.milestone_stage[index].toObject(),
        ...milestone,
      }));
    }

    const updatedData = await this.bid.findByIdAndUpdate(data._id, updatedPayload, { new: true });

    if (!updatedData) throw new HttpException(400, 2009, 'BID_REQUEST_ERROR');

    return updatedData;
  }

  public async updateMilestoneById(selector: string, milestoneId: string, milestoneData: Partial<BiddingStage>): Promise<any> {
    const { error } = updateMilestoneStageSchema.validate(milestoneData);
    if (error) throw new HttpException(400, 2002, 'BID_VALIDATION_ERROR', [error.details[0].message]);

    const data = await this.bid.findOne({ id: selector });
    if (!data) throw new HttpException(400, 2002, 'BID_NOT_FOUND');

    const updatedMilestones = data.milestone_stage.map((milestone: any) => {
      if (milestone._id.toString() === milestoneId) {
        return {
          ...milestone.toObject(),
          ...milestoneData,
        };
      }
      return milestone;
    });

    console.log('UPDATED', updatedMilestones);

    const updatedData = await this.bid.findByIdAndUpdate(data._id, { milestone_stage: updatedMilestones }, { new: true });

    if (!updatedData) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return updatedData;
  }

  public async requestMilestoneReview(proposalId: string, milestoneId: string, clientId: string): Promise<any> {
    const data = await this.bid.findOne({ id: proposalId });
    if (!data) throw new HttpException(400, 2002, 'BID_NOT_FOUND');

    const milestoneData = data.milestone_stage.map((milestone: any) => {
      if (milestone._id.toString() === milestoneId) {
        return milestone;
      }
      return milestone;
    });

    const user: any = await this.userService.findUserById(clientId);
    if (!user) throw new HttpException(400, 2002, 'CLIENT_NOT_FOUND');

    console.log('UPDATED', milestoneData);

    const payload = {
      milestoneDescription: milestoneData.description,
      job
    }
    await this.emailService.sendMilestoneReviewEmail(user.email, verifyEmailToken, user.first_name);

    return updatedData;
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
  | getAllBidders
  |--------------------------------------------------------------------------
  */
  public async getAllBidders(id: string | mongoose.Types.ObjectId): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 4004, 'id canhh not be empty');

    const data = await this.bid.find({ job_id: id });
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

    const filter = {
      job_id: id,
    };

    const data = await this.bid.paginate(filter, options);

    if (!data) throw new HttpException(400, 4003, 'BIDDERS_NOT_FOUND');

    const results = await Promise.all(
      data.results.map(async (job: any) => {
        const about = await this.aboutService.getUserAbout(job.user_id.toString());
        const job_data = await this.jobService.getJobByJobId(job.job_id.toString());
        const job_match = calculateMatchPercentage(about.skills, job_data.jobs_tags);
        return { proposal: job, profile_details: about, job_match };
      }),
    );

    return { ...data, results };
  }

  /*
  |--------------------------------------------------------------------------
  | getTopBidders
  |--------------------------------------------------------------------------
  */
  public async getProposalById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 4004, 'id can not be empty');

    const data = await this.bid.findOne({ id });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Bid By Job
  |--------------------------------------------------------------------------
  */
  public async getBidByJob(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.bid.findOne({ job_id: id });
    // if (!data) throw new HttpException(400, 2002, 'BID_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Bid By Id
  |--------------------------------------------------------------------------
  */
  public async getBidById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.bid.findOne({ id: id });
    // if (!data) throw new HttpException(400, 2002, 'BID_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Like Proposal
  |--------------------------------------------------------------------------
  */
  public async likeProposal(proposalId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(proposalId)) throw new HttpException(400, 2001, 'id can not be empty');

    const proposal = await this.bid.findOne({ id: proposalId });
    console.log(proposal);
    if (!proposal) throw new HttpException(400, 2002, 'PROPOSAL_NOT_FOUND');

    if (proposal.liked === true) throw new HttpException(400, 2002, 'PROPOSAL_ALREADY_LIKED');

    if (proposal.disliked === true) proposal.disliked = false;

    proposal.liked = true;
    await proposal.save();

    return proposal;
  }

  /*
  |--------------------------------------------------------------------------
  | DisLike Proposal
  |--------------------------------------------------------------------------
  */
  public async dislikeProposal(proposalId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(proposalId)) throw new HttpException(400, 2001, 'id can not be empty');

    const proposal = await this.bid.findOne({ id: proposalId });
    if (!proposal) throw new HttpException(400, 2002, 'PROPOSAL_NOT_FOUND');

    if (proposal.disliked === true) throw new HttpException(400, 2002, 'PROPOSAL_ALREADY_DISLIKED');

    if (proposal.liked === true) proposal.liked = false;

    proposal.disliked = true;
    await proposal.save();

    return proposal;
  }

  /*
  |--------------------------------------------------------------------------
  | Archive Proposal
  |--------------------------------------------------------------------------
  */
  public async archiveProposal(payload: any): Promise<any> {
    const data: any = await this.archive.create(payload);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | ShortList Proposal
  |--------------------------------------------------------------------------
  */
  public async shortListProposal(payload: any): Promise<any> {
    const data: any = await this.shortlist.create(payload);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Archive Proposal By Id
  |--------------------------------------------------------------------------
  */
  public async getArchiveProposalById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.archive.findOne({ proposal: id });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Saved Job
  |--------------------------------------------------------------------------
  */
  public async getUserArchivedProposals(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    try {
      const archive = await this.archive.find({ client_id: id }).lean().populate({ path: 'proposal' });
      if (!archive) throw new HttpException(400, 2002, 'ARCHIVE_NOT_FOUND');

      // const archivedIds = (await this.archive.find({ client_id: id }).lean().select('proposal')).map((proposal: { proposal: any }) =>
      //   proposal.proposal.toString(),
      // );

      const results = await Promise.all(
        archive.map(async (archive: any) => {
          const about = await this.aboutService.getUserAbout(archive.user_id.toString());
          const job_data = await this.jobService.getJobByJobId(archive.proposal.job_id.toString());
          const job_match = calculateMatchPercentage(about.skills, job_data.jobs_tags);
          return {
            proposal: archive.proposal,
            profile_details: about,
            job_match,
            // is_archived: archivedIds.includes(archive.proposal.job_id.toString()),
          };
        }),
      );

      return results;
    } catch (error) {
      console.log(error);
      throw new HttpException(500, 5000, 'Internal server error');
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Get Archive Proposal By Id
  |--------------------------------------------------------------------------
  */
  public async getShortListById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.shortlist.findOne({ proposal: id });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Saved Job
  |--------------------------------------------------------------------------
  */
  public async getUserShortLists(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    try {
      const archive = await this.shortlist.find({ client_id: id }).lean().populate({ path: 'proposal' });
      if (!archive) throw new HttpException(400, 2002, 'SHORTLIST_NOT_FOUND');

      // const archivedIds = (await this.archive.find({ client_id: id }).lean().select('proposal')).map((proposal: { proposal: any }) =>
      //   proposal.proposal.toString(),
      // );

      const results = await Promise.all(
        archive.map(async (archive: any) => {
          const about = await this.aboutService.getUserAbout(archive.user_id.toString());
          const job_data = await this.jobService.getJobByJobId(archive.proposal.job_id.toString());
          const job_match = calculateMatchPercentage(about.skills, job_data.jobs_tags);
          return {
            proposal: archive.proposal,
            profile_details: about,
            job_match,
            // is_archived: archivedIds.includes(archive.proposal.job_id.toString()),
          };
        }),
      );

      return results;
    } catch (error) {
      console.log(error);
      throw new HttpException(500, 5000, 'Internal server error');
    }
  }
}

export default BidService;
