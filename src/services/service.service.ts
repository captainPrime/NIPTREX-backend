import { PaginationOptions } from '@/interfaces/job.inteface';
import { HireServiceModel, IService, ServiceModel } from '@/models/service.models';
import { serviceUpdateValidationSchema, serviceValidationSchema } from '@/validations/service.validation';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import mongoose from 'mongoose';

class ServiceService {
  public service: any = ServiceModel;
  public hireService: any = HireServiceModel;

  /*
  |--------------------------------------------------------------------------
  | Create Service
  |--------------------------------------------------------------------------
  */
  public async createService(body: IService): Promise<IService> {
    if (isEmpty(body)) throw new HttpException(400, 2005, 'All required fields cannot be empty');

    const { error } = serviceValidationSchema.validate(body);

    if (error) throw new HttpException(400, 2002, 'SERVICE_VALIDATION_ERROR', [error.details[0].message]);

    const data: IService = await this.service.create(body);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Service
  |--------------------------------------------------------------------------
  */
  public async getAllService(filter: any, options: PaginationOptions): Promise<any[]> {
    const data = await this.service.paginate(filter, options);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Service by ID
  |--------------------------------------------------------------------------
  */
  public async getServiceById(id: mongoose.Types.ObjectId | string): Promise<IService> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'ID cannot be empty');

    const data: IService | null = await this.service.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'SERVICE_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Service by ID
  |--------------------------------------------------------------------------
  */
  public async getServiceByUserId(id: mongoose.Types.ObjectId | string): Promise<IService[] | null> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'ID cannot be empty');

    const data: IService[] | null = await this.service.find({ user_id: id });
    if (!data) throw new HttpException(400, 2002, 'SERVICE_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Service by ID
  |--------------------------------------------------------------------------
  */
  public async updateServiceById(id: mongoose.Types.ObjectId | string, body: Partial<IService>): Promise<IService> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'ID cannot be empty');

    const { error } = serviceUpdateValidationSchema.validate(body);

    if (error) throw new HttpException(400, 2002, 'SERVICE_VALIDATION_ERROR', [error.details[0].message]);

    const data: IService | null = await this.service.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'SERVICE_NOT_FOUND');

    const updatedPayload = {
      ...data.toObject(),
      price: {
        ...data.price,
        ...body.price,
      },
      ...body,
    };

    const updatedData: IService | null = await this.service.findByIdAndUpdate(id, updatedPayload, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 2009, 'SERVICE_REQUEST_ERROR');

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Service by ID
  |--------------------------------------------------------------------------
  */
  public async deleteService(id: mongoose.Types.ObjectId | string): Promise<IService> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'ID cannot be empty');

    const data: IService | null = await this.service.findByIdAndDelete(id);
    if (!data) throw new HttpException(400, 2009, 'SERVICE_REQUEST_ERROR');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Hire Service
  |--------------------------------------------------------------------------
  */
  public async hireFreelancerService(payload: any): Promise<any> {
    if (isEmpty(payload)) throw new HttpException(400, 2001, 'payload can not be empty');
    const data = await this.hireService.create(payload);
    return data;
  }
}

export default ServiceService;
