import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import InvoiceService from '@/services/invoice.service';
import { IUpdateInvoice } from '@/models/invoice.model';
import { calculateServiceFee, calculateVAT } from '@/utils/matchPercentage';
import ServiceService from '@/services/service.service';
import BidService from '@/services/bid.service';

class InvoiceController {
  public bidService = new BidService();
  public userService = new UserService();
  public invoiceService = new InvoiceService();
  public serviceService = new ServiceService();

  /*
  |--------------------------------------------------------------------------
  | Create Invoice
  |--------------------------------------------------------------------------
  */
  public createInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const proposalId = req.body.proposal_id;
      const serviceProposal = await this.serviceService.getServiceProposalById(proposalId);
      const jobProposal = await this.bidService.getProposalById(proposalId);

      if (!serviceProposal && !jobProposal) {
        throw new HttpException(400, 5002, 'PROPOSAL_NOT_FOUND');
      }

      const existingInvoice = await this.invoiceService.getInvoiceByproposalId(proposalId);
      if (existingInvoice && existingInvoice.length !== 0) {
        throw new HttpException(400, 5002, 'INVOICE_ALREADY_ADDED');
      }

      const invoiceData = {
        ...userData,
        user_id: req.user.id,
        vat: calculateVAT(req.user.country),
        service_fee: calculateServiceFee(),
      };

      const invoice = await this.invoiceService.createInvoice(invoiceData);

      res.status(200).json({ status: 200, response_code: 3000, message: 'INVOICE_REQUEST_SUCCESSFUL', data: invoice });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get User Invoice
  |--------------------------------------------------------------------------
  */
  public getUserInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = await this.userService.findUserById(req.user.id);

      if (!user.verified) {
        throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
      }

      const data = await this.invoiceService.getUserInvoice(req.user.id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'INVOICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Invoice By Id
  |--------------------------------------------------------------------------
  */
  public getInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.invoiceService.getInvoiceById(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'INVOICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update Invoice
  |--------------------------------------------------------------------------
  */
  public updateInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IUpdateInvoice = req.body;
      const data = await this.invoiceService.updateInvoiceById(req.params.id, body);

      res.status(200).json({ status: 200, response_code: 3000, message: 'INVOICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Invoice
  |--------------------------------------------------------------------------
  */
  public deleteInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data = await this.invoiceService.deleteInvoice(id);

      res.status(200).json({ status: 200, response_code: 3000, message: 'INVOICE_REQUEST_SUCCESSFUL', data });
    } catch (error) {
      next(error);
    }
  };
}

export default InvoiceController;
