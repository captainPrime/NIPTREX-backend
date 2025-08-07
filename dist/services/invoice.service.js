"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const HttpException_1 = require("@exceptions/HttpException");
const util_1 = require("@utils/util");
const users_service_1 = tslib_1.__importDefault(require("./users.service"));
const invoice_model_1 = require("@/models/invoice.model");
const invoice_validation_1 = require("@/validations/invoice.validation");
class InvoiceService {
    constructor() {
        this.invoice = invoice_model_1.Invoice;
        this.userService = new users_service_1.default();
    }
    /*
    |--------------------------------------------------------------------------
    | Create Invoice
    |--------------------------------------------------------------------------
    */
    async createInvoice(body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 8005, "You're not userData");
        const { error } = invoice_validation_1.invoiceSchema.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 8002, 'INVOICE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.invoice.create(body);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get User Invoice
    |--------------------------------------------------------------------------
    */
    async getUserInvoice(userId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 8001, 'User id can not be empty');
        const data = await this.invoice.find({ user_id: userId });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Invoice By Proposal ID
    |--------------------------------------------------------------------------
    */
    async getInvoiceByproposalId(proposalId) {
        if ((0, util_1.isEmpty)(proposalId))
            throw new HttpException_1.HttpException(400, 8001, 'User id can not be empty');
        const data = await this.invoice.find({ proposal_id: proposalId });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Invoice By Id
    |--------------------------------------------------------------------------
    */
    async getInvoiceById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 8001, 'id can not be empty');
        const data = await this.invoice.findOne({ _id: id });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Update Invoice By Id
    |--------------------------------------------------------------------------
    */
    async updateInvoiceById(id, body) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 8001, 'id can not be empty');
        const { error } = invoice_validation_1.invoiceUpdateSchema.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 8002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.invoice.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 8002, 'INVOICE_NOT_FOUND');
        const updatedData = await this.invoice.findByIdAndUpdate(id, body, {
            new: true,
        });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 8009, 'INVOICE_REQUEST_ERROR');
        return updatedData;
    }
    /*
    |--------------------------------------------------------------------------
    | Delete Invoice
    |--------------------------------------------------------------------------
    */
    async deleteInvoice(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 8001, 'id can not be empty');
        const data = await this.invoice.findByIdAndDelete(id);
        if (!data)
            throw new HttpException_1.HttpException(400, 8009, 'INVOICE_REQUEST_ERROR');
        return data;
    }
}
exports.default = InvoiceService;
//# sourceMappingURL=invoice.service.js.map