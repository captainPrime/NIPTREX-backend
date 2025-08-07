"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const users_service_1 = tslib_1.__importDefault(require("@/services/users.service"));
const HttpException_1 = require("@/exceptions/HttpException");
const bank_service_1 = tslib_1.__importDefault(require("@/services/bank.service"));
class BankController {
    constructor() {
        this.userService = new users_service_1.default();
        this.bankService = new bank_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Add bank
        |--------------------------------------------------------------------------
        */
        this.createBank = async (req, res, next) => {
            try {
                const userData = req.body;
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const bio = await this.bankService.getUserBank(req.user.id);
                if (bio.length !== 0)
                    throw new HttpException_1.HttpException(400, 9002, 'BIO_ALREAD_ADDED');
                const data = await this.bankService.addBankInfo(Object.assign(Object.assign({}, userData), { user_id: req.user.id }));
                res.status(200).json({ status: 200, response_code: 9000, message: 'BILLING_ADDRESS_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Bank
        |--------------------------------------------------------------------------
        */
        this.getUserBank = async (req, res, next) => {
            try {
                const data = await this.bankService.getUserBank(req.user.id);
                res.status(200).json({ status: 200, response_code: 9000, message: 'BILLING_ADDRESS_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Bank By Id
        |--------------------------------------------------------------------------
        */
        this.getBankById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.bankService.getBankById(id);
                res.status(200).json({ status: 200, response_code: 9000, message: 'BILLING_ADDRESS_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update Bank Info
        |--------------------------------------------------------------------------
        */
        this.updateBankInfo = async (req, res, next) => {
            try {
                const body = req.body;
                const data = await this.bankService.updateBankInfo(req.user.id, body);
                res.status(200).json({ status: 200, response_code: 9000, message: 'BILLING_ADDRESS_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Delete Bank Info
        |--------------------------------------------------------------------------
        */
        this.deleteBankInfo = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.bankService.deleteBank(id);
                res.status(200).json({ status: 200, response_code: 9000, message: 'BILLING_ADDRESS_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = BankController;
//# sourceMappingURL=bank.controller.js.map