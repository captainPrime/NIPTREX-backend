import { NextFunction, Request, Response } from 'express';
import ServiceService from '@/services/service.service';
import { IService } from '@/models/service.models';

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
      const data: IService[] | null = await this.serviceService.getAllService();

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
}

export default ServiceController;
