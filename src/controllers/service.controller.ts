import axios from 'axios';
import { FLW_SECRET_KEY } from '@/config';
import { flw } from '@/modules/flutterwave';
import UserService from '@/services/users.service';
import WalletService from '@/services/wallet.service';
import { generateUUID } from '@/utils/matchPercentage';
import ServiceService from '@/services/service.service';
import EmailService from '@/modules/email/email.service';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exceptions/HttpException';
import { PaginationOptions } from '@/interfaces/job.inteface';
import { IService, IServiceProposal, ServiceProposalStatus } from '@/models/service.models';

class ServiceController {
  public userService = new UserService();
  public emailService = new EmailService();
  public walletService = new WalletService();
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

      const options: PaginationOptions = {
        sortBy: req.query.sortBy || 'created_at:desc',
        limit: parseInt(req.query.limit as string, 10) || 10,
        page: parseInt(req.query.page as string, 10) || 1,
        projectBy: req.query.projectBy || 'name:hide, role:hide',
        search: (req.query.search as any) || '',
      };

      const filter = { user_id: id };

      const data: IService[] | null = await this.serviceService.getServiceByUserId(filter, options);

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
        sortBy: req.query.sortBy || 'created_at:desc',
        limit: parseInt(req.query.limit as string, 10) || 10,
        page: parseInt(req.query.page as string, 10) || 1,
        projectBy: req.query.projectBy || 'name:hide, role:hide',
        search: (req.query.search as any) || '',
        populate: 'user_id.first_name.last_name.profile_picture',
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
        proposal_id: service._id.toString(),
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
  | getAppliedServices
  |--------------------------------------------------------------------------
  */
  public getAppliedServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user.id;

      const options: PaginationOptions = {
        sortBy: 'created_at:desc',
        limit: parseInt(req.query.limit as string, 10) || 10,
        page: parseInt(req.query.page as string, 10) || 1,
        projectBy: req.query.projectBy || 'name:hide, role:hide',
        populate: 'service,user_id,proposal',
      };

      const data = await this.serviceService.getAppliedServices(userId, options);

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

      const serviceProposals = await this.serviceService.getAllServiceProposalByServiceId(service_id);

      console.log(serviceProposals);
      const hasOngoingService = serviceProposals.some(
        (proposal: any) => proposal.status !== ServiceProposalStatus.COMPLETED && proposal.client_id.id.toString() === req.user.id,
      );
      if (hasOngoingService) {
        throw new HttpException(400, 7007, 'HAS_ONGOING_SERVICE');
      }

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

  /*
  |--------------------------------------------------------------------------
  | Get all Service Proposal by service id
  |--------------------------------------------------------------------------
  */
  public getAllServiceProposal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service_id: string = req.params.id;
      const data = await this.serviceService.getAllServiceProposal(service_id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | getServiceProposalById
  |--------------------------------------------------------------------------
  */
  public getServiceProposalById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serviceProposalId: string = req.params.id;
      const data = await this.serviceService.getServiceProposalById(serviceProposalId);

      res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update Service Proposal by ID
  |--------------------------------------------------------------------------
  */
  public updateServiceProposalById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const body: Partial<IServiceProposal> = req.body;

      const data: IServiceProposal | null = await this.serviceService.updateServiceProjectById(id, body);

      res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Charge Card
  |--------------------------------------------------------------------------
  */
  public makePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, currency, proposal_id } = req.body;

      const serviceProposal = await this.serviceService.getServiceProposalById(proposal_id);
      if (!serviceProposal) throw new HttpException(400, 7002, 'SERVICE_PROPOSAL_NOT_FOUND');

      // if (amount < serviceProposal.amount) throw new HttpException(400, 2002, 'AMOUNT_LESS_THAN_PROPOSAL_AMOUNT');

      const paymentData = {
        tx_ref: generateUUID(),
        amount,
        currency,
        redirect_url: 'http://localhost:3000/service/verify-payment',
        meta: {
          consumer_id: req.user.id,
          consumer_mac: proposal_id,
        },
        customer: {
          email: req.user.email,
          phonenumber: req.user.phone_number,
          name: `${req.user.first_name} ${req.user.last_name}`,
        },
      };

      const response = await axios.post('https://api.flutterwave.com/v3/payments', paymentData, {
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
        },
      });

      res.status(200).json({ status: 200, response_code: 6000, message: 'SERVICE_REQUEST_SUCCESSFUL', data: response.data.data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Charge Card
  |--------------------------------------------------------------------------
  */
  public paymentCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, transaction_id } = req.body;
      if (status === 'successful' || status === 'completed') {
        // const transactionDetails = await flw.Transaction.find({ ref: tx_ref });
        const response = await flw.Transaction.verify({ id: transaction_id });
        // console.log('TRANSACTION_DETAILS', transactionDetails);
        console.log('TRANSACTION_VERIFY', response);
        if (response.data.status === 'successful') {
          // Success! Confirm the customer's payment
          const user: any = await this.userService.findUserById(response.data.meta.consumer_id);

          const proposal = await this.serviceService.getServiceProposalById(response.data.meta.consumer_mac.toString());
          if (!proposal) throw new HttpException(400, 7002, 'PROPOSAL_NOT_FOUND');

          if (proposal && proposal.status == ServiceProposalStatus.PAID) throw new HttpException(400, 7002, 'PAYMENT_ALREADY_VERIFIED');

          console.log('PROPOSAL', proposal);
          const service = await this.serviceService.getServiceById(proposal.service_id.toString());
          if (!service) throw new HttpException(400, 7002, 'SERVICE_NOT_FOUND');

          const transactionData: any = {
            user_id: user.id,
            proposal_id: response.data.meta?.consumer_mac,
            tx_ref: response.data.tx_ref,
            flw_ref: response.data.flw_ref,
            amount: response.data.amount,
            currency: response.data.currency,
            status: response.data.status,
            payment_type: response.data.payment_type,
            created_at: new Date(response.data.created_at),
            customer_id: response.data.customer?.id.toString() ?? response.meta?.consumer_id.toString(),
            customer_name: response.data.customer?.name,
            customer_email: response.data.customer?.email,
            nuban: response.data.meta?.originatoraccountnumber,
            bank: response.data.meta?.bankname,
            bank_name: response.data.meta?.originatorname,
            card_first_6digits: response.data.card?.first_6digits,
            card_last_4digits: response.data.card?.last_4digits,
            card_issuer: response.data.card?.issuer,
            card_country: response.data.card?.country,
            card_type: response.data.card?.type,
            card_expiry: response.data.card?.expiry,
          };

          const transaction = await this.walletService.createTransaction(transactionData);
          const emailPayload = {
            proposalId: proposal.id,
            jobTitle: service.title,
          };

          this.emailService.sendPaymentConfirmationEmail(user.email, emailPayload, user.first_name);

          const payload = {
            user_id: service.user_id,
            service: service._id.toString(),
            client: proposal.client_id._id.toString(),
            proposal: proposal._id.toString(),
          };

          await this.serviceService.hireFreelancerService(payload);

          await this.serviceService.updateServiceProjectById(proposal.id.toString(), { status: ServiceProposalStatus.PAID });

          res.status(200).json({ status: 200, response_code: 6000, message: 'SERVICE_REQUEST_SUCCESSFUL', data: transaction });
        } else {
          res.status(200).json({ status: 400, response_code: 6000, message: 'SERVICE_REQUEST_ERROR', data: [] });
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Request Service Review
  |--------------------------------------------------------------------------
  */
  public requestServiceReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { proposal_id, client_id } = req.body;

      await this.serviceService.requestServiceReview(proposal_id, client_id, req.user.id);

      res.status(200).json({ status: 200, response_code: 6000, message: 'SERVICE_REQUEST_SUCCESSFUL', data: [] });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Approve Service
  |--------------------------------------------------------------------------
  */
  public approveService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const body: Partial<IServiceProposal> = req.body;

      const data: IServiceProposal | null = await this.serviceService.approveService(id, req.user.id, body);

      res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default ServiceController;
