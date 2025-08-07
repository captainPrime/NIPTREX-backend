"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const auth_middleware_1 = tslib_1.__importDefault(require("@/middlewares/auth.middleware"));
const invoice_controller_1 = tslib_1.__importDefault(require("@/controllers/invoice.controller"));
class InvoiceRoute {
    constructor() {
        this.path = '/invoice';
        this.router = (0, express_1.Router)();
        this.invoiceController = new invoice_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.invoiceController.createInvoice);
        this.router.get(`${this.path}/getInvoiceById/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.invoiceController.getInvoiceById);
        this.router.put(`${this.path}/updateInvoice/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.invoiceController.updateInvoice);
        this.router.get(`${this.path}/getUserInvoice`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.invoiceController.getUserInvoice);
    }
}
exports.default = InvoiceRoute;
//# sourceMappingURL=invoice.route.js.map