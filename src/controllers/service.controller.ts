import { NextFunction, Request, Response } from 'express';
import ServiceService from '@/services/service.service';
import { IService } from '@/models/service.models';
import { HttpException } from '@/exceptions/HttpException';
import { PaginationOptions } from '@/interfaces/job.inteface';

class ServiceController {
  public serviceService = new ServiceService();

  /*
  |--------------------------------------------------------------------------
  | Create Service
  |--------------------------------------------------------------------------
  */
  public createService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serviceData: any = req.body;
      const user_id: any = req.user.id;

      const data: any = await this.serviceService.createService({ ...serviceData, user_id });

      res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Service by ID
  |--------------------------------------------------------------------------
  */
  public getServiceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;

      const data: IService | null = await this.serviceService.getServiceById(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Service by user ID
  |--------------------------------------------------------------------------
  */
  public getServiceByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;

      const data: IService[] | null = await this.serviceService.getServiceByUserId(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
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
        populate: 'user_id',
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

  /*
  |--------------------------------------------------------------------------
  | Hire Freelancer
  |--------------------------------------------------------------------------
  */
  public serviceProposal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service_id: string = req.params.id;

      const { amount, package_type, delivery_date } = req.body;

      const serviceData = await this.serviceService.getServiceById(service_id);
      if (!serviceData) throw new HttpException(400, 7006, 'SERVICE_NOT_FOUND');

      const service = await this.serviceService.getServiceProposalById(service_id);
      if (service && service.client_id.toString() === req.user.id) throw new HttpException(400, 7008, 'SERVICE_ALREADY_PROPOSED');

      const payload = {
        client_id: req.user.id,
        service_id,
        amount,
        delivery_date,
        package_type,
      };

      const data = await this.serviceService.createServiceProposal(payload);

      res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default ServiceController;
