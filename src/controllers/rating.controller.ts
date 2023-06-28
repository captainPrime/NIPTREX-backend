import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exceptions/HttpException';
import { PaginationOptions } from '@/interfaces/job.inteface';
import RatingService from '@/services/rating.service';
import { IRating } from '@/models/rating.model';

class RatingController {
  public ratingService = new RatingService();

  /*
  |--------------------------------------------------------------------------
  | Rate Entity
  |--------------------------------------------------------------------------
  */
  public rateEntity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ratingData: IRating | any = req.body;
      const user_id: any = req.user.id;
      const entity_id: any = req.params.id;

      const data: any = await this.ratingService.rateEntity({ ...ratingData, entity_id });

      res.status(200).json({ status: 200, response_code: 8000, message: 'RATING_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Rating by ID
  |--------------------------------------------------------------------------
  */
  public getRatingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;

      const data: IRating | null = await this.ratingService.getRatingById(id);

      res.status(200).json({ status: 200, response_code: 8000, message: 'RATING_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Rating by user ID
  |--------------------------------------------------------------------------
  */
  public getRatingByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;

      const data: IRating[] | null = await this.ratingService.getRatingByUserId(id);

      res.status(200).json({ status: 200, response_code: 8000, message: 'RATING_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get User Service
  |--------------------------------------------------------------------------
  */
  public getUserService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.user.id;

      const data: IService[] | null = await this.serviceService.getServiceByUserId(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Services
  |--------------------------------------------------------------------------
  */
  public getAllServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options: PaginationOptions = {
        sortBy: req.query.sortBy || 'date_posted:desc',
        limit: parseInt(req.query.limit as string, 10) || 5,
        page: parseInt(req.query.page as string, 10) || 1,
        projectBy: req.query.projectBy || 'name:hide, role:hide',
      };

      const data: any[] | null = await this.serviceService.getAllService(req.query, options);

      res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update Service by ID
  |--------------------------------------------------------------------------
  */
  public updateServiceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const body: Partial<IService> = req.body;

      const data: IService = await this.serviceService.updateServiceById(id, body);

      res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Service by ID
  |--------------------------------------------------------------------------
  */
  public deleteService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;

      const data: IService = await this.serviceService.deleteService(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Hire Freelancer
  |--------------------------------------------------------------------------
  */
  public hireFreelancerService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id: string = req.params.id;

      const service = await this.serviceService.getServiceById(req.body.service);
      if (!service) throw new HttpException(400, 7002, 'SERVICE_NOT_FOUND');

      const payload = {
        user_id,
        service: service._id.toString(),
        client: req.user.id,
      };

      const data = await this.serviceService.hireFreelancerService(payload);

      res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default RatingController;
