import mongoose from 'mongoose';
import { isEmpty } from '@utils/util';
import JobService from './job.service';
import UserService from './users.service';
import AboutService from './about.service';
import { HttpException } from '@exceptions/HttpException';
import { ArchiveProposalModel, BiddingModel, IBidding } from '@/models/bid.model';
import { PaginationOptions } from '@/interfaces/job.inteface';
import { calculateMatchPercentage } from '@/utils/matchPercentage';
import { biddingSchemaValidation } from '@/validations/bid.validation';

class BidService {
  public bid: any = BiddingModel;
  public archive: any = ArchiveProposalModel;
  public aboutService = new AboutService();
  public userService = new UserService();
  public jobService = new JobService();

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

    const data = await this.bid.paginate({ job_id: id }, options);

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

    const data = await this.archive.find({ client_id: id }).populate('proposal');
    if (!data) throw new HttpException(400, 2002, 'ARCHIVE_NOT_FOUND');

    // const savedJobIds = (await this.archive.find({ user_id: id })).map((job: { job: any }) => job.job.toString());

    // const updatedData = data.map((job: any) => {
    //   return {
    //     ...job.toJSON(),
    //     is_saved: savedJobIds.includes(job.job.id.toString()),
    //   };
    // });

    return data;
  }
}

export default BidService;
