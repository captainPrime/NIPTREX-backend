/* eslint-disable security/detect-non-literal-regexp */
import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
// import { HttpException } from '@/exceptions/HttpException';
import JobService from '@/services/job.service';
import { jobPayload } from '@/utils/jobPayload';
import { HttpException } from '@/exceptions/HttpException';
import AboutService from '@/services/about.service';
import PreferenceService from '@/services/preference.service';
import { skills } from '@/utils/skills';

class JobController {
  public userService = new UserService();
  public aboutService = new AboutService();
  public jobService = new JobService();
  public preferenceService = new PreferenceService();

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
  public getAllSkills = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data: skills });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | getUserJobBestMatches
  |--------------------------------------------------------------------------
  */
  public getUserJobBestMatches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobQueries: any = [];
      const about = await this.aboutService.getUserAbout(req.user.id);
      if (!about) throw new HttpException(400, 2002, 'USER_NOT_FOUND');

      const preference = await this.preferenceService.getUserPreference(req.user.id);
      if (!preference) throw new HttpException(400, 2002, 'USER_NOT_FOUND');

      console.log('preference', preference[0]);

      about[0].skills.forEach((skill: string) => jobQueries.push(skill));

      console.log('QUERY', jobQueries);
      const data = await this.jobService.getUserJobBestMatches(jobQueries, preference[0]);

      res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get JOB By Id
  |--------------------------------------------------------------------------
  */
  public getJobById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.jobService.getJobById(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  |getUserSavedJobs
  |--------------------------------------------------------------------------
  */
  public getUserSavedJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.jobService.getUserSavedJobs(req.user.id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get JOB By Id
  |--------------------------------------------------------------------------
  */
  public savedJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;

      const job = await this.jobService.getJobById(id);
      if (!job) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

      const saveJob = await this.jobService.getSavedJobById(job._id.toString());
      if (saveJob.length !== 0) throw new HttpException(400, 5002, 'JOB_ALREAD_ADDED');

      const { jobsTags, jobTitle, jobSubInfo, jobDescription, verified, rating, location, jobType, jobSize } = job;
      const payload = {
        user_id: req.user.id,
        job_id: job._id.toString(),
        jobsTags,
        jobTitle,
        jobSubInfo,
        jobDescription,
        verified,
        rating,
        location,
        jobType,
        jobSize,
      };

      const data = await this.jobService.savedJob(payload);

      res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get JOB By Id
  |--------------------------------------------------------------------------
  */
  public unSaveJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;

      await this.jobService.deleteSavedJob(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL' });
    } catch (error) {
      next(error);
    }
  };
}

export default JobController;
