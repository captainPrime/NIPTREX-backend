/* eslint-disable security/detect-non-literal-regexp */
import mongoose from 'mongoose';

import { isEmpty } from '@utils/util';
import User from '@/models/users.model';
import UserService from './users.service';
import AboutService from './about.service';
import { HttpException } from '@exceptions/HttpException';
import { Hire, JobModel, SavedJob } from '@/models/job.model';
import { calculateMatchPercentage } from '@/utils/matchPercentage';
import { IJob, IUpdateJob, PaginationOptions } from '@/interfaces/job.inteface';
import { jobSchemaUpdateValidation, jobSchemaValidation } from '@/validations/job.validation';
import { BiddingModel } from '@/models/bid.model';

class JobService {
  public hire: any = Hire;
  public user: any = User;
  public job: any = JobModel;
  public bid: any = BiddingModel;
  public saveJob: any = SavedJob;
  public userService = new UserService();
  public aboutService = new AboutService();

  /*
  |--------------------------------------------------------------------------
  | Create Job
  |--------------------------------------------------------------------------
  */
  public async createJob(body: IJob): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 2005, 'Request body cannot be empty');

    const { error } = jobSchemaValidation.validate(body);

    console.log(body);

    if (error) throw new HttpException(400, 2002, 'JOB_VALIDATION_ERROR', [error.details[0].message]);
    const data: any = await this.job.create(body);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Create Job
  |--------------------------------------------------------------------------
  */
  public async updateJob(selector: string, body: IUpdateJob): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 2005, 'Request body cannot be empty');

    const { error } = jobSchemaUpdateValidation.validate(body);
    if (error) throw new HttpException(400, 2002, 'JOB_VALIDATION_ERROR', [error.details[0].message]);

    const data = await this.job.findOne({ user_id: selector });
    if (!data) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

    const updatedPayload = {
      ...data.toObject(),
      activities: {
        ...data.activities.toObject(),
        ...body.activities,
      },
      ...body,
    };

    const updatedData = await this.job.findByIdAndUpdate(data._id, updatedPayload, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Create Job
  |--------------------------------------------------------------------------
  */
  public async updateJobById(id: string, body: IUpdateJob): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 2005, 'Request body cannot be empty');

    const { error } = jobSchemaUpdateValidation.validate(body);
    if (error) throw new HttpException(400, 2002, 'JOB_VALIDATION_ERROR', [error.details[0].message]);

    const data = await this.job.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

    const updatedPayload = {
      ...data.toObject(),
      activities: {
        ...data.activities.toObject(),
        ...body.activities,
      },
      ...body,
    };

    const updatedData = await this.job.findByIdAndUpdate(data._id, updatedPayload, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Save Job
  |--------------------------------------------------------------------------
  */
  public async savedJob(payload: any): Promise<any> {
    const data: any = await this.saveJob.create(payload);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Job Best Matches
  |--------------------------------------------------------------------------
  */
  public async getUserJobBestMatches(query: any, userId: string, otherQuery: any, options: PaginationOptions): Promise<any> {
    const regexTags = query.map((tag: string | RegExp) => new RegExp(tag, 'i'));
    const filter = {
      jobs_tags: { $in: regexTags },
      ...otherQuery,
    };

    const data = await this.job.paginate(filter, options);
    if (!data) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

    const savedJobIds = (await this.saveJob.find({ user_id: userId })).map((job: { job: any }) => job.job.toString());

    const updatedData = data.results.map((job: any) => {
      return {
        ...job.toJSON(),
        is_saved: savedJobIds.includes(job._id.toString()),
      };
    });
    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Job Best Matches
  |--------------------------------------------------------------------------
  */
  public async getMostRecentJobs(query: any, userId: string, otherQuery: any, options: PaginationOptions): Promise<any> {
    const regexTags = query.map((tag: string | RegExp) => new RegExp(tag, 'i'));
    const filter = {
      jobs_tags: { $in: regexTags },
      ...otherQuery,
    };

    const data = await this.job.paginate(filter, options);
    if (!data) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

    const savedJobIds = (await this.saveJob.find({ user_id: userId })).map((job: { job: any }) => job.job.toString());

    const updatedData = data.results.map((job: any) => {
      return {
        ...job.toJSON(),
        is_saved: savedJobIds.includes(job._id.toString()),
      };
    });

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | getAllJobs
  |--------------------------------------------------------------------------
  */
  public async getAllJobs(filter: any, options: PaginationOptions): Promise<any> {
    const data = await this.job.paginate(filter, options);
    if (!data) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

    const savedJobIds = (await this.saveJob.find({ user_id: userId })).map((job: { job: any }) => job.job.toString());

    const updatedData = data.results.map((job: any) => {
      return {
        ...job.toJSON(),
        is_saved: savedJobIds.includes(job._id.toString()),
      };
    });

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Job By Id
  |--------------------------------------------------------------------------
  */
  public async getJobById(id: string, userId: string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id cannot be empty');

    const data = await this.job.findOne({ _id: id }).populate({
      path: 'user_id',
      select: 'first_name last_name email phone_number country createdAt', // fields to be returned from the referenced document
      options: {
        lean: true, // return plain JS objects instead of Mongoose documents
      },
      as: 'posted_by', // the name of the key to populate, defaults to the path
    });

    if (!data) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

    const about = await this.aboutService.getUserAbout(userId);

    const savedJob = await this.saveJob.findOne({ user_id: userId, job: id });

    const proposal = await this.bid.findOne({ job_id: id, user_id: userId });
    // if (!proposal) throw new HttpException(400, 2002, 'PROPOSAL_NOT_FOUND');

    const updatedData = {
      ...data.toJSON(),
      is_saved: !!savedJob,
      applied: !!proposal,
      profile_match: calculateMatchPercentage(about?.skills, data.jobs_tags),
    };

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Similar Jobs
  |--------------------------------------------------------------------------
  */
  public async getSimilarJobs(id: string, query: any): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id cannot be empty');
    const regexTags = query.map((tag: string | RegExp) => new RegExp(tag, 'i'));
    const filter = {
      jobs_tags: { $in: regexTags },
      _id: { $ne: id },
    };

    const data = await this.job.find(filter);

    if (!data) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

    // const about = await this.aboutService.getUserAbout(userId);

    // const savedJob = await this.saveJob.findOne({ user_id: userId, job: id });

    // const updatedData = {
    //   ...data.toJSON(),
    //   is_saved: !!savedJob,
    //   profile_match: calculateMatchPercentage(about.skills, data.jobs_tags),
    // };

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Job By Id
  |--------------------------------------------------------------------------
  */
  public async getJobByJobId(id: string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'job id can not be empty');

    const data = await this.job.findOne({ _id: id });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Job By Id
  |--------------------------------------------------------------------------
  */
  public async getJobByClientId(userId: string, otherQuery: any, options: PaginationOptions): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'id can not be empty');

    const filter = {
      user_id: userId,
      ...otherQuery,
    };

    const data = await this.job.paginate(filter, options);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Saved Job By Id
  |--------------------------------------------------------------------------
  */
  public async getSavedJobById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.saveJob.find({ job: id });
    if (!data) throw new HttpException(400, 2002, 'SAVED_JOB_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Saved Job By Id
  |--------------------------------------------------------------------------
  */
  public async deleteSavedJob(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.saveJob.remove({ job: id });
    if (!data) throw new HttpException(400, 2002, 'SAVED_JOB_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Saved Job
  |--------------------------------------------------------------------------
  */
  public async getUserSavedJobs(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.saveJob.find({ user_id: id }).populate('job');
    if (!data) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

    const savedJobIds = (await this.saveJob.find({ user_id: id })).map((job: { job: any }) => job.job.toString());

    const updatedData = data.map((job: any) => {
      return {
        ...job.toJSON(),
        is_saved: savedJobIds.includes(job.job.id.toString()),
      };
    });

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Saved Job
  |--------------------------------------------------------------------------
  */
  public async getUserSavedItems(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.saveJob.find({ user_id: id });
    if (!data) throw new HttpException(400, 2002, 'SAVED_JOB_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Hire Freelancer
  |--------------------------------------------------------------------------
  */
  public async hireFreelancer(payload: any): Promise<any> {
    if (isEmpty(payload)) throw new HttpException(400, 2001, 'payload can not be empty');
    const data = await this.hire.create(payload);
    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Work History
  |--------------------------------------------------------------------------
  */
  public async freelanceWorkHistory(userId: string, otherQuery: any, options: PaginationOptions): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'payload can not be empty');

    const filter = {
      user_id: userId.toString(),
      ...otherQuery,
    };

    const data = await this.hire.paginate(filter, options);
    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Freelance Contracts
  |--------------------------------------------------------------------------
  */
  public async getFreelancerContracts(userId: string, otherQuery: any, options: PaginationOptions): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'user id can not be empty');

    const filter = {
      user_id: userId.toString(),
      ...otherQuery,
    };
    const data = await this.bid.paginate(filter, options);

    // const results = await Promise.all(
    //   data.results.map(async (job: any) => {
    //     const user = await this.userService.get(job.user_id.toString());
    //     return { client_details: user, job_match };
    //   }),
    // );

    // return { ...data, results };
    return data;
  }
}

export default JobService;
