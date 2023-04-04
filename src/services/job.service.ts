import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
import mongoose from 'mongoose';
import { IJob, JobModel } from '@/models/job.model';

class JobService {
  public job: any = JobModel;
  public userService = new UserService();

  /*
  |--------------------------------------------------------------------------
  | Create Job
  |--------------------------------------------------------------------------
  */
  public async createJob(body: IJob[]): Promise<any> {
    const data: any = await this.job.insertMany(body);

    await this.userService.updateUser(data.user_id, { has_identity: true });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Job Best Matches
  |--------------------------------------------------------------------------
  */
  public async getUserJobBestMatches(userId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

    const data = await this.job.find({ user_id: userId });
    if (!data) throw new HttpException(400, 2002, 'IDENTITY_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | getAllJobs
  |--------------------------------------------------------------------------
  */
  public async getAllJobs(): Promise<any> {
    const data = await this.job.find({});
    if (!data) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

    return data;
  }
}

export default JobService;
