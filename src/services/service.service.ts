import { PaginationOptions } from '@/interfaces/job.inteface';
import { HireServiceModel, IService, IServiceProposal, ServiceModel, ServiceProposalModel, ServiceProposalStatus } from '@/models/service.models';
import EmailService from '@/modules/email/email.service';
import { serviceUpdateValidationSchema, serviceValidationSchema, updateServiceProposalStatusValidation } from '@/validations/service.validation';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import mongoose from 'mongoose';
import UserService from './users.service';

class ServiceService {
  public service: any = ServiceModel;
  public userService = new UserService();
  public emailService = new EmailService();
  public hireService: any = HireServiceModel;
  public serviceProposal: any = ServiceProposalModel;

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

    const data: IService | null = await this.service.findOne({ _id: id }).populate('user_id');
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

  /*
  |--------------------------------------------------------------------------
  | getAppliedServices
  |--------------------------------------------------------------------------
  */
  public async getAppliedServices(userId: string, options: PaginationOptions): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'payload can not be empty');

    const filter = {
      client: userId.toString(),
      status: ServiceProposalStatus.PAID,
    };

    const data = await this.hireService.paginate(filter, options);
    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Hire Service
  |--------------------------------------------------------------------------
  */
  public async createServiceProposal(payload: any): Promise<any> {
    if (isEmpty(payload)) throw new HttpException(400, 2001, 'payload can not be empty');
    const data = await this.serviceProposal.create(payload);
    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Service Proposal By Id
  |--------------------------------------------------------------------------
  */
  public async getServiceProposalByIdInternal(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.serviceProposal.findOne({ _id: id }).populate({
      path: 'client_id',
    });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Service Proposal By Id
  |--------------------------------------------------------------------------
  */
  public async getServiceProposalById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.serviceProposal.findOne({ _id: id }).populate({
      path: 'client_id',
      select: 'first_name last_name profile_picture',
    });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Service Proposal By Id
  |--------------------------------------------------------------------------
  */
  public async getServiceProposalByServiceId(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.serviceProposal.findOne({ service_id: id }).populate({
      path: 'client_id',
      select: 'first_name last_name profile_picture',
    });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Service Proposal By Id
  |--------------------------------------------------------------------------
  */
  public async getAllServiceProposalByServiceId(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.serviceProposal.find({ service_id: id }).populate({
      path: 'client_id',
      select: 'first_name last_name profile_picture',
    });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Service Proposal
  |--------------------------------------------------------------------------
  */
  public async getAllServiceProposal(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.serviceProposal.find({ service_id: id }).populate({
      path: 'client_id',
      select: 'first_name last_name profile_picture',
    });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Service by ID
  |--------------------------------------------------------------------------
  */
  public async updateServiceProjectById(id: mongoose.Types.ObjectId | string, body: Partial<IServiceProposal>): Promise<IServiceProposal> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'ID cannot be empty');

    const { error } = updateServiceProposalStatusValidation.validate(body);

    if (error) throw new HttpException(400, 2002, 'SERVICE_VALIDATION_ERROR', [error.details[0].message]);

    const data: IServiceProposal | null = await this.serviceProposal.findOne({ _id: id });
    if (!data) throw new HttpException(400, 7002, 'SERVICE_PROPOSAL_NOT_FOUND');

    const updatedData: IServiceProposal | null = await this.serviceProposal.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 2009, 'SERVICE_REQUEST_ERROR');

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Request Service Review
  |--------------------------------------------------------------------------
  */
  public async requestServiceReview(proposalId: string, clientId: string, userId: string): Promise<any> {
    if (isEmpty(proposalId) || isEmpty(clientId)) {
      throw new HttpException(400, 4004, 'proposal_id, client_id and proposal_type are required.');
    }

    // find service proposal
    const serviceProposal = await this.serviceProposal.findOne({ _id: new mongoose.Types.ObjectId(proposalId) });
    if (!serviceProposal) throw new HttpException(400, 2002, 'SERVICE_PROPOSAL_NOT_FOUND');

    // find service
    const service = await this.service.findOne({ _id: new mongoose.Types.ObjectId(serviceProposal.service_id) });
    if (!service) throw new HttpException(400, 2002, 'SERVICE_NOT_FOUND');

    console.log(serviceProposal);
    if (serviceProposal.client_id != clientId || serviceProposal.client_id === userId) throw new HttpException(400, 2002, 'UNAUTHORIZE_USER');

    const client: any = await this.userService.findUserById(clientId);
    if (!client) throw new HttpException(400, 2002, 'CLIENT_NOT_FOUND');

    await this.emailService.sendServiceReviewEmail(client.email, { serviceName: service.title }, client.first_name);
  }

  /*
  |--------------------------------------------------------------------------
  | Approve Service
  |--------------------------------------------------------------------------
  */
  public async approveService(id: mongoose.Types.ObjectId | string, userId: string, body: Partial<IServiceProposal>): Promise<IServiceProposal> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'ID cannot be empty');

    const { error } = updateServiceProposalStatusValidation.validate(body);

    if (error) throw new HttpException(400, 2002, 'SERVICE_VALIDATION_ERROR', [error.details[0].message]);

    const data: IServiceProposal | null = await this.serviceProposal.findOne({ _id: id });
    if (!data) throw new HttpException(400, 7002, 'SERVICE_PROPOSAL_NOT_FOUND');

    if (data.client_id != userId) throw new HttpException(400, 2002, 'UNAUTHORIZE_USER');

    const updatedData: IServiceProposal | null = await this.serviceProposal.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 2009, 'SERVICE_REQUEST_ERROR');

    return updatedData;
  }
}

export default ServiceService;
