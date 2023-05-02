/* eslint-disable security/detect-non-literal-regexp */
import mongoose from 'mongoose';

import { isEmpty } from '@utils/util';
import User from '@/models/users.model';
import UserService from './users.service';
import { HttpException } from '@exceptions/HttpException';
import { Hire, JobModel, SavedJob } from '@/models/job.model';
import { IJob, IUpdateJob, PaginationOptions } from '@/interfaces/job.inteface';
import { jobSchemaUpdateValidation, jobSchemaValidation } from '@/validations/job.validation';

class JobService {
  public hire: any = Hire;
  public user: any = User;
  public job: any = JobModel;
  public saveJob: any = SavedJob;
  public userService = new UserService();

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

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Job By Id
  |--------------------------------------------------------------------------
  */
  public async getJobById(id: string, userId: string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id cannot be empty');

    const data = await this.job.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

    const savedJob = await this.saveJob.findOne({ user_id: userId, job: id });

    const updatedData = {
      ...data.toJSON(),
      is_saved: !!savedJob,
    };

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Job By Id
  |--------------------------------------------------------------------------
  */
  public async getJobByJobId(id: string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.job.findOne({ _id: id });

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
}

export default JobService;
