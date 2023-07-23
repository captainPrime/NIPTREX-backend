import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
import mongoose from 'mongoose';
import { IInvoice, IUpdateInvoice, Invoice } from '@/models/invoice.model';
import { invoiceSchema, invoiceUpdateSchema } from '@/validations/invoice.validation';

class InvoiceService {
  public invoice: any = Invoice;
  public userService = new UserService();

  /*
  |--------------------------------------------------------------------------
  | Create Invoice
  |--------------------------------------------------------------------------
  */
  public async createInvoice(body: IInvoice): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 8005, "You're not userData");

    const { error } = invoiceSchema.validate(body);

    if (error) throw new HttpException(400, 8002, 'INVOICE_VALIDATION_ERROR', [error.details[0].message]);

    const data: any = await this.invoice.create(body);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Invoice
  |--------------------------------------------------------------------------
  */
  public async getUserInvoice(userId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 8001, 'User id can not be empty');

    const data = await this.invoice.find({ user_id: userId });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Invoice By Proposal ID
  |--------------------------------------------------------------------------
  */
  public async getInvoiceByproposalId(proposalId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(proposalId)) throw new HttpException(400, 8001, 'User id can not be empty');

    const data = await this.invoice.find({ proposal_id: proposalId });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Invoice By Id
  |--------------------------------------------------------------------------
  */
  public async getInvoiceById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 8001, 'id can not be empty');

    const data = await this.invoice.findOne({ _id: id });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Invoice By Id
  |--------------------------------------------------------------------------
  */
  public async updateInvoiceById(id: mongoose.Types.ObjectId | string, body: IUpdateInvoice): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 8001, 'id can not be empty');

    const { error } = invoiceUpdateSchema.validate(body);

    if (error) throw new HttpException(400, 8002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);

    const data = await this.invoice.findOne({ _id: id });
    if (!data) throw new HttpException(400, 8002, 'INVOICE_NOT_FOUND');

    const updatedData = await this.invoice.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 8009, 'INVOICE_REQUEST_ERROR');

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Invoice
  |--------------------------------------------------------------------------
  */
  public async deleteInvoice(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 8001, 'id can not be empty');

    const data = await this.invoice.findByIdAndDelete(id);
    if (!data) throw new HttpException(400, 8009, 'INVOICE_REQUEST_ERROR');

    return data;
  }
}

export default InvoiceService;
