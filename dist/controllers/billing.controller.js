"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const users_service_1 = tslib_1.__importDefault(require("../services/users.service"));
const HttpException_1 = require("../exceptions/HttpException");
const billing_service_1 = tslib_1.__importDefault(require("../services/billing.service"));
class BillingController {
    constructor() {
        this.userService = new users_service_1.default();
        this.billingService = new billing_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Create Billing
        |--------------------------------------------------------------------------
        */
        this.createBilling = async (req, res, next) => {
            try {
                const userData = req.body;
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const billing = await this.billingService.getUserBilling(req.user.id);
                if (billing.length !== 0)
                    throw new HttpException_1.HttpException(400, 5002, 'BILLING_ALREAD_ADDED');
                const data = await this.billingService.createBilling(Object.assign(Object.assign({}, userData), { user_id: req.user.id }));
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Billing
        |--------------------------------------------------------------------------
        */
        this.getUserBilling = async (req, res, next) => {
            try {
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const data = await this.billingService.getUserBilling(req.user.id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Billing By Id
        |--------------------------------------------------------------------------
        */
        this.getBillingById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.billingService.getBillingById(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update Billing
        |--------------------------------------------------------------------------
        */
        this.updateBilling = async (req, res, next) => {
            try {
                const body = req.body;
                const data = await this.billingService.updateBillingById(req.user.id, body);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Delete Billing
        |--------------------------------------------------------------------------
        */
        this.deleteBilling = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.billingService.deleteBilling(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = BillingController;
//# sourceMappingURL=billing.controller.js.map