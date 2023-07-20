import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import InvoiceController from '@/controllers/invoice.controller';

class InvoiceRoute implements Routes {
  public path = '/invoice';
  public router = Router();
  public invoiceController = new InvoiceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware(['freelancer', 'client']), this.invoiceController.createInvoice);
    this.router.get(`${this.path}/getInvoiceById/:id`, authMiddleware(['freelancer', 'client']), this.invoiceController.getInvoiceById);
    this.router.put(`${this.path}/updateInvoice/:id`, authMiddleware(['freelancer', 'client']), this.invoiceController.updateInvoice);
    this.router.get(`${this.path}/getUserInvoice`, authMiddleware(['freelancer', 'client']), this.invoiceController.getUserInvoice);
  }
}

export default InvoiceRoute;
