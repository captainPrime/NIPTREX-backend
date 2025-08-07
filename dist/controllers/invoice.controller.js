"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const users_service_1 = tslib_1.__importDefault(require("@/services/users.service"));
const HttpException_1 = require("@/exceptions/HttpException");
const invoice_service_1 = tslib_1.__importDefault(require("@/services/invoice.service"));
const matchPercentage_1 = require("@/utils/matchPercentage");
const service_service_1 = tslib_1.__importDefault(require("@/services/service.service"));
const bid_service_1 = tslib_1.__importDefault(require("@/services/bid.service"));
class InvoiceController {
    constructor() {
        this.bidService = new bid_service_1.default();
        this.userService = new users_service_1.default();
        this.invoiceService = new invoice_service_1.default();
        this.serviceService = new service_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Create Invoice
        |--------------------------------------------------------------------------
        */
        this.createInvoice = async (req, res, next) => {
            try {
                const userData = req.body;
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const proposalId = req.body.proposal_id;
                const serviceProposal = await this.serviceService.getServiceProposalById(proposalId);
                const jobProposal = await this.bidService.getProposalById(proposalId);
                if (!serviceProposal && !jobProposal) {
                    throw new HttpException_1.HttpException(400, 5002, 'PROPOSAL_NOT_FOUND');
                }
                // const existingInvoice = await this.invoiceService.getInvoiceByproposalId(proposalId);
                // if (existingInvoice && existingInvoice.length !== 0) {
                //   throw new HttpException(400, 5002, 'INVOICE_ALREADY_ADDED');
                // }
                const invoiceData = Object.assign(Object.assign({}, userData), { user_id: req.user.id, vat: (0, matchPercentage_1.calculateVAT)(req.user.country), service_fee: (0, matchPercentage_1.calculateServiceFee)() });
                const invoice = await this.invoiceService.createInvoice(invoiceData);
                res.status(200).json({ status: 200, response_code: 3000, message: 'INVOICE_REQUEST_SUCCESSFUL', data: invoice });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Invoice
        |--------------------------------------------------------------------------
        */
        this.getUserInvoice = async (req, res, next) => {
            try {
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const data = await this.invoiceService.getUserInvoice(req.user.id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'INVOICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Invoice By Id
        |--------------------------------------------------------------------------
        */
        this.getInvoiceById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.invoiceService.getInvoiceById(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'INVOICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update Invoice
        |--------------------------------------------------------------------------
        */
        this.updateInvoice = async (req, res, next) => {
            try {
                const body = req.body;
                const data = await this.invoiceService.updateInvoiceById(req.params.id, body);
                res.status(200).json({ status: 200, response_code: 3000, message: 'INVOICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Delete Invoice
        |--------------------------------------------------------------------------
        */
        this.deleteInvoice = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.invoiceService.deleteInvoice(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'INVOICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = InvoiceController;
//# sourceMappingURL=invoice.controller.js.map