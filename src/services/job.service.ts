/* eslint-disable security/detect-non-literal-regexp */
import mongoose from 'mongoose';

import { isEmpty } from '@utils/util';
import User from '@/models/users.model';
import UserService from './users.service';
import { HttpException } from '@exceptions/HttpException';
import { JobModel, SavedJob } from '@/models/job.model';
import { IJob, PaginationOptions } from '@/interfaces/job.inteface';

class JobService {
  public job: any = JobModel;
  public user: any = User;
  public saveJob: any = SavedJob;
  public userService = new UserService();

  /*
  |--------------------------------------------------------------------------
  | Create Job
  |--------------------------------------------------------------------------
  */
  public async createJob(body: IJob[]): Promise<any> {
    const data: any = await this.job.insertMany(body);

    return data;
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
  public async getUserJobBestMatches(query: any, _preference: any, userId: string): Promise<any> {
    const regexTags = query.map((tag: string | RegExp) => new RegExp(tag, 'i'));
    const filter = {
      jobsTags: { $in: regexTags },
      // jobSize: new RegExp(preference.company_size, 'i'),
    };

    const data = await this.job.find(filter).limit(10);
    if (!data) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

    const savedJobIds = (await this.saveJob.find({ user_id: userId })).map((job: { job: any }) => job.job.toString());

    const updatedData = data.map((job: any) => {
      return {
        ...job.toJSON(),
        isSaved: savedJobIds.includes(job._id.toString()),
      };
    });
    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Job Best Matches
  |--------------------------------------------------------------------------
  */
  public async getMostRecentJobs(query: any, userId: string): Promise<any> {
    const regexTags = query.map((tag: string | RegExp) => new RegExp(tag, 'i'));
    const filter = {
      jobsTags: { $in: regexTags },
    };

    const data = await this.job.find(filter).sort({ createdAt: -1 }).limit(10);
    if (!data) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

    const savedJobIds = (await this.saveJob.find({ user_id: userId })).map((job: { job: any }) => job.job.toString());

    const updatedData = data.map((job: any) => {
      return {
        ...job.toJSON(),
        isSaved: savedJobIds.includes(job._id.toString()),
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
  public async getJobById(id: string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.job.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

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
        isSaved: savedJobIds.includes(job.job.id.toString()),
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
}

export default JobService;
