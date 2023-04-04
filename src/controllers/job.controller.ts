import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
// import { HttpException } from '@/exceptions/HttpException';
import JobService from '@/services/job.service';
import { jobPayload } from '@/utils/jobPayload';

class JobController {
  public userService = new UserService();
  public jobService = new JobService();

  /*
  |--------------------------------------------------------------------------
  | Create Billing
  |--------------------------------------------------------------------------
  */
  public createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.jobService.createJob(jobPayload);

      res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get all Jobs
  |--------------------------------------------------------------------------
  */
  public getAllJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.jobService.getAllJobs();

      res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default JobController;
