// import Profile from '@/models/profile.model';
import { BiddingModel } from '@/models/bid.model';
import { Hire, JobModel, SavedJob } from '@/models/job.model';
import { About, Billing, Identity, Education, Experience, Preference, Certification } from '@/models/profile.model';
import { ServiceModel } from '@/models/service.models';
import User from '@/models/users.model';
import { NextFunction, Request, Response } from 'express';

class IndexController {
  public users = User;
  public bid: any = BiddingModel;
  public job: any = JobModel;
  public hire: any = Hire;
  public saveJob: any = SavedJob;
  public about: any = About;
  public billing: any = Billing;
  public identity: any = Identity;
  public education: any = Education;
  public experience: any = Experience;
  public preference: any = Preference;
  public certification: any = Certification;
  public service: any = ServiceModel;

  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        msg: 'Hello from App server',
        Time: new Date(),
        status: 'running',
        server: 'Express + TS Server',
      });
    } catch (error) {
      next(error);
    }
  };

  public reloadDb = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.users.deleteMany({});
      await this.about.deleteMany({});
      await this.billing.deleteMany({});
      await this.identity.deleteMany({});
      await this.education.deleteMany({});
      await this.experience.deleteMany({});
      await this.preference.deleteMany({});
      await this.certification.deleteMany({});
      await this.job.deleteMany({});
      await this.saveJob.deleteMany({});
      await this.bid.deleteMany({});
      await this.hire.deleteMany({});
      await this.service.deleteMany({});

      const user = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@gmail.com',
        password: 'johndoe21',
        user: 'client',
        verified: true,
        has_profile: false,
        country: 'Nigeria',
      };
      const user2 = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'freelancer@gmail.com',
        password: 'freelancer',
        user: 'freelancer',
        verified: true,
        has_profile: false,
        country: 'Nigeria',
      };
      const user3 = {
        first_name: 'Freeman',
        last_name: 'Doe',
        email: 'freelancer2@gmail.com',
        password: 'freelancer2',
        user: 'freelancer',
        verified: true,
        has_profile: false,
        country: 'Nigeria',
      };

      await this.users.create(user);
      await this.users.create(user2);
      await this.users.create(user3);

      res.status(200).json({ status: 200, response_code: 2000, message: 'DATABASE_RELOAD_SUCCESSFUL' });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
