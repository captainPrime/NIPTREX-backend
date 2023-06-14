import { IService, ServiceModel } from '@/models/service.models';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import mongoose from 'mongoose';

class ServiceService {
  public service: any = ServiceModel;

  /*
  |--------------------------------------------------------------------------
  | Create Service
  |--------------------------------------------------------------------------
  */
  public async createService(body: IService): Promise<IService> {
    if (isEmpty(body)) throw new HttpException(400, 2005, 'All required fields cannot be empty');

    const data: IService = await this.service.create(body);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Service
  |--------------------------------------------------------------------------
  */
  public async getAllService(): Promise<IService[]> {
    const data: IService[] = await this.service.find({});

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

    const data: IService | null = await this.service.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'SERVICE_NOT_FOUND');

    const updatedData: IService | null = await this.service.findByIdAndUpdate(id, body, {
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
}

export default ServiceService;
