import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import InvoiceService from '@/services/invoice.service';
import { IUpdateInvoice } from '@/models/invoice.model';
import { calculateServiceFee, calculateVAT } from '@/utils/matchPercentage';
import ServiceService from '@/services/service.service';

class InvoiceController {
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

      const proposal = await this.serviceService.getServiceProposalById(req.body.proposal_id);
      if (!proposal) throw new HttpException(400, 5002, 'SERVICE_PROPOSAL_NOT_FOUND');

      const invoice = await this.invoiceService.getInvoiceByproposalId(req.body.proposal_id);
      if (invoice && invoice.length !== 0) throw new HttpException(400, 5002, 'INVOICE_ALREAD_ADDED');

      const data = await this.invoiceService.createInvoice({
        ...userData,
        user_id: req.user.id,
        vat: calculateVAT(req.user.country),
        service_fee: calculateServiceFee(),
      });

      res.status(200).json({ status: 200, response_code: 3000, message: 'INVOICE_REQUEST_SUCCESSFUL', data });
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
