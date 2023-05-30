/* eslint-disable security/detect-non-literal-regexp */
import { NextFunction, Request, Response } from 'express';

import JobService from '@/services/job.service';
import UserService from '@/services/users.service';
import AboutService from '@/services/about.service';
import { HttpException } from '@/exceptions/HttpException';
import PreferenceService from '@/services/preference.service';
import { skills, skillsWithOutSection, softSkills } from '@/utils/skills';
import { IUpdateJob, JobStatus, PaginationOptions } from '@/interfaces/job.inteface';
import BidService from '@/services/bid.service';
import { BiddingStatus } from '@/models/bid.model';

class JobController {
  public jobService = new JobService();
  public bidService = new BidService();
  public userService = new UserService();
  public aboutService = new AboutService();
  public preferenceService = new PreferenceService();

  /*
  |--------------------------------------------------------------------------
  | Create Billing
  |--------------------------------------------------------------------------
  */
  public createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const data = await this.jobService.createJob({ ...req.body, user_id: req.user.id });

      res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Create Billing
  |--------------------------------------------------------------------------
  */
  public updateJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IUpdateJob = req.body;

      const data = await this.jobService.updateJob(req.user.id, body);

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
  | Get all Jobs
  |--------------------------------------------------------------------------
  */
  public getAllSoftSkills = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data: softSkills });
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
      if (about) about?.skills.forEach((skill: string) => jobQueries.push(skill));

      const options: PaginationOptions = {
        sortBy: req.query.sortBy || 'name:desc',
        limit: parseInt(req.query.limit as string, 10) || 5,
        page: parseInt(req.query.page as string, 10) || 1,
        projectBy: req.query.projectBy || 'name:hide, role:hide',
      };

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

      about.skills.forEach((skill: string) => jobQueries.push(skill));

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
  | get similar jobs
  |--------------------------------------------------------------------------
  */
  public getSimilarJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobQueries: any = [];
      const jobId: any = req.params.id;

      const jobs = await this.jobService.getJobByJobId(jobId);
      console.log('JOBS', jobs);
      if (jobs) jobs?.jobs_tags.forEach((tag: string) => jobQueries.push(tag));

      // const options: PaginationOptions = {
      //   sortBy: req.query.sortBy || 'name:desc',
      //   limit: parseInt(req.query.limit as string, 10) || 5,
      //   page: parseInt(req.query.page as string, 10) || 1,
      //   projectBy: req.query.projectBy || 'name:hide, role:hide',
      // };

      const data = await this.jobService.getSimilarJobs(jobId, jobQueries);

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
      const data = await this.jobService.getJobById(id, req.user.id);

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
  public getJobByClientId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;

      const options: PaginationOptions = {
        sortBy: req.query.sortBy || 'name:desc',
        limit: parseInt(req.query.limit as string, 10) || 5,
        page: parseInt(req.query.page as string, 10) || 1,
        projectBy: req.query.projectBy || 'name:hide, role:hide',
      };

      const data = await this.jobService.getJobByClientId(id, req.query, options);

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

      const job = await this.jobService.getJobByJobId(id);
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

  /*
  |--------------------------------------------------------------------------
  | Hire Freelancer
  |--------------------------------------------------------------------------
  */
  public hireFreelancer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id: string = req.params.id;

      const job = await this.jobService.getJobByJobId(req.body.job_id);
      if (!job) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');
      const payload = {
        user_id,
        job_id: job._id.toString(),
        client_id: job.user_id.toString(),
      };

      const data = await this.jobService.hireFreelancer(payload);

      // update job
      await this.jobService.updateJobById(job._id.toString(), {
        status: JobStatus.TAKEN,
        freelancer_id: user_id,
        activities: { invites_sent: +1, interviewing: +1, unanswered_invites: +1 },
      });

      // return user nips
      const bidders = await this.bidService.getAllBidders(job._id.toString());
      const userIds = bidders.filter((bidder: any) => bidder.user_id.toString() !== user_id).map((bidder: any) => bidder.user_id.toString());

      await this.bidService.updateBid(user_id, { status: BiddingStatus.IN_PROGRESS });
      userIds.forEach(async (userId: any) => {
        await this.aboutService.updateAboutById(userId, { nips: +5 });
        await this.bidService.updateBid(userId, { status: BiddingStatus.CLOSED });
      });

      res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Hire Freelancer
  |--------------------------------------------------------------------------
  */
  public getFreelancerContracts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.query.id ?? req.user.id;

      const jobQueries: any = [];
      const about = await this.aboutService.getUserAbout(userId);
      if (!about) throw new HttpException(400, 2002, 'USER_NOT_FOUND');

      about.skills.forEach((skill: string) => jobQueries.push(skill));

      const options: PaginationOptions = {
        sortBy: req.query.sortBy || 'createdAt:desc',
        limit: parseInt(req.query.limit as string, 10) || 5,
        page: parseInt(req.query.page as string, 10) || 1,
        projectBy: req.query.projectBy || 'name:hide, role:hide',
        populate: 'job_id,user_id',
      };

      const job = await this.jobService.getFreelancerContracts(userId, req.query, options);
      if (!job) throw new HttpException(400, 2002, 'JOB_NOT_FOUND');

      res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data: job });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Freelance Work History
  |--------------------------------------------------------------------------
  */
  public freelanceWorkHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.query.id ?? req.user.id;

      const options: PaginationOptions = {
        sortBy: req.query.sortBy || 'name:desc',
        limit: parseInt(req.query.limit as string, 10) || 5,
        page: parseInt(req.query.page as string, 10) || 1,
        projectBy: req.query.projectBy || 'name:hide, role:hide',
        populate: 'job_id',
      };

      const data = await this.jobService.freelanceWorkHistory(id, req.query, options);

      res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default JobController;
