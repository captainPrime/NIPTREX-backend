import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import InvoiceService from '@/services/invoice.service';
import ServiceService from '@/services/service.service';
import BidService from '@/services/bid.service';
declare class InvoiceController {
    bidService: BidService;
    userService: UserService;
    invoiceService: InvoiceService;
    serviceService: ServiceService;
    createInvoice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserInvoice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getInvoiceById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateInvoice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteInvoice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default InvoiceController;
