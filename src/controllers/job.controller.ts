/* eslint-disable security/detect-non-literal-regexp */
import { NextFunction, Request, Response } from 'express';

import JobService from '@/services/job.service';
import UserService from '@/services/users.service';
import AboutService from '@/services/about.service';
import { HttpException } from '@/exceptions/HttpException';
import PreferenceService from '@/services/preference.service';
import { skills, skillsWithOutSection } from '@/utils/skills';
import { PaginationOptions } from '@/interfaces/job.inteface';

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
      const data = await this.jobService.createJob(req.body);

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
      const options: PaginationOptions = {
        sortBy: req.query.sortBy || 'name:desc',
        limit: parseInt(req.query.limit as string, 10) || 5,
        page: parseInt(req.query.page as string, 10) || 1,
        projectBy: req.query.projectBy || 'name:hide, role:hide',
      };
      const data = await this.jobService.getAllJobs(req.query, options);

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
  public getAllSkillsCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data: skills });
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
      res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data: skillsWithOutSection });
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

      // const preference = await this.preferenceService.getUserPreference(req.user.id);
      // if (!preference) throw new HttpException(400, 2002, 'USER_NOT_FOUND');

      const options: PaginationOptions = {
        sortBy: req.query.sortBy || 'name:desc',
        limit: parseInt(req.query.limit as string, 10) || 5,
        page: parseInt(req.query.page as string, 10) || 1,
        projectBy: req.query.projectBy || 'name:hide, role:hide',
      };

      about[0].skills.forEach((skill: string) => jobQueries.push(skill));

      const data = await this.jobService.getUserJobBestMatches(jobQueries, req.user.id, req.query, options);

      res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | getMostRecentJobs
  |--------------------------------------------------------------------------
  */
  public getMostRecentJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobQueries: any = [];
      const about = await this.aboutService.getUserAbout(req.user.id);
      if (!about) throw new HttpException(400, 2002, 'USER_NOT_FOUND');

      about[0].skills.forEach((skill: string) => jobQueries.push(skill));

      const options: PaginationOptions = {
        sortBy: req.query.sortBy || 'createdAt:desc',
        limit: parseInt(req.query.limit as string, 10) || 5,
        page: parseInt(req.query.page as string, 10) || 1,
        projectBy: req.query.projectBy || 'name:hide, role:hide',
      };

      const data = await this.jobService.getMostRecentJobs(jobQueries, req.user.id, req.query, options);

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
  |getUserSavedJobs
  |--------------------------------------------------------------------------
  */
  public getUserSavedItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.jobService.getUserSavedItems(req.user.id);

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

      const payload = {
        user_id: req.user.id,
        job: job._id.toString(),
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
