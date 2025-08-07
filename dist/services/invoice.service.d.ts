import UserService from './users.service';
import mongoose from 'mongoose';
import { IInvoice, IUpdateInvoice } from '@/models/invoice.model';
declare class InvoiceService {
    invoice: any;
    userService: UserService;
    createInvoice(body: IInvoice): Promise<any>;
    getUserInvoice(userId: mongoose.Types.ObjectId | string): Promise<any>;
    getInvoiceByproposalId(proposalId: mongoose.Types.ObjectId | string): Promise<any>;
    getInvoiceById(id: mongoose.Types.ObjectId | string): Promise<any>;
    updateInvoiceById(id: mongoose.Types.ObjectId | string, body: IUpdateInvoice): Promise<any>;
    deleteInvoice(id: mongoose.Types.ObjectId | string): Promise<any>;
}
export default InvoiceService;
