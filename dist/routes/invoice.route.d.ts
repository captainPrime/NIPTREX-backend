import { Routes } from '@interfaces/routes.interface';
import InvoiceController from '@/controllers/invoice.controller';
declare class InvoiceRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    invoiceController: InvoiceController;
    constructor();
    private initializeRoutes;
}
export default InvoiceRoute;
