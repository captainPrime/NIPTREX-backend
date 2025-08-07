"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const HttpException_1 = require("../exceptions/HttpException");
const util_1 = require("../utils/util");
const users_service_1 = tslib_1.__importDefault(require("./users.service"));
const profile_model_1 = require("../models/profile.model");
const profile_validation_1 = require("../validations/profile.validation");
class BankService {
    constructor() {
        this.bank = profile_model_1.BillingAddress;
        this.userService = new users_service_1.default();
    }
    /*
    |--------------------------------------------------------------------------
    | Add bank Info
    |--------------------------------------------------------------------------
    */
    async addBankInfo(body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 9005, 'All required fields cannot be empty');
        const { error } = profile_validation_1.billingAddressSchemaValidation.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 9002, 'BILLING_ADDRESS_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.bank.create(body);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get User Bank
    |--------------------------------------------------------------------------
    */
    async getUserBank(userId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 9001, 'User id can not be empty');
        const data = await this.bank.find({ user_id: userId });
        if (!data)
            throw new HttpException_1.HttpException(400, 9003, 'BILLING_ADDRESS_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Bank By Id
    |--------------------------------------------------------------------------
    */
    async getBankById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 9001, 'id can not be empty');
        const data = await this.bank.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 9003, 'BILLING_ADDRESS_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Update Bio By Id
    |--------------------------------------------------------------------------
    */
    async updateBankInfo(id, body) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 9001, 'id can not be empty');
        const { error } = profile_validation_1.billingAddressUpdateValidation.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 9002, 'BILLING_ADDRESS_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.bank.findOne({ user_id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 9003, 'BILLING_ADDRESS_NOT_FOUND');
        const updatedData = await this.bank.findByIdAndUpdate(data._id, body, {
            new: true,
        });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 9009, 'BILLING_ADDRESS_REQUEST_ERROR');
        return updatedData;
    }
    /*
    |--------------------------------------------------------------------------
    | Delete Bank
    |--------------------------------------------------------------------------
    */
    async deleteBank(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.bank.findByIdAndDelete(id);
        if (!data)
            throw new HttpException_1.HttpException(400, 9009, 'BILLING_ADDRESS_REQUEST_ERROR');
        return data;
    }
}
exports.default = BankService;
//# sourceMappingURL=bank.service.js.map