import Profile from '@/models/profile.model';
import User from '@/models/users.model';
import { NextFunction, Request, Response } from 'express';

class IndexController {
  public users = User;
  public profile: any = Profile;

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
      await this.profile.deleteMany({});

      res.status(200).json({ status: 200, response_code: 2000, message: 'DATABASE_RELOAD_SUCCESSFUL' });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
