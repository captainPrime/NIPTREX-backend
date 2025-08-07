"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const HttpException_1 = require("@exceptions/HttpException");
const util_1 = require("@utils/util");
const users_service_1 = tslib_1.__importDefault(require("./users.service"));
const config_model_1 = require("@/models/config.model");
const config_validation_1 = require("@/validations/config.validation");
class ConfigService {
    constructor() {
        this.config = config_model_1.Config;
        this.userService = new users_service_1.default();
    }
    /*
    |--------------------------------------------------------------------------
    | Create Config
    |--------------------------------------------------------------------------
    */
    async createConfig(body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 2005, "You're not userData");
        const { error } = config_validation_1.configSchemaValidation.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 9002, 'CONFIG_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.config.create(body);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get User Config
    |--------------------------------------------------------------------------
    */
    async getAllConfig() {
        const data = await this.config.find({});
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'CONFIG_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Config By Id
    |--------------------------------------------------------------------------
    */
    async getConfigById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.config.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 9004, 'CONFIG_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Update Config By Id
    |--------------------------------------------------------------------------
    */
    async updateConfigById(id, body) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 9001, 'id can not be empty');
        const { error } = config_validation_1.configUpdateValidation.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 9002, 'CONFIG_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.config.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 9004, 'CONFIG_NOT_FOUND');
        const updatedData = await this.config.findByIdAndUpdate(data._id, body, {
            new: true,
        });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 9009, 'CONFIG_REQUEST_ERROR');
        return updatedData;
    }
    /*
    |--------------------------------------------------------------------------
    | Delete Config
    |--------------------------------------------------------------------------
    */
    async deleteConfig(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.config.findByIdAndDelete(id);
        if (!data)
            throw new HttpException_1.HttpException(400, 9009, 'CONFIG_REQUEST_ERROR');
        return data;
    }
}
exports.default = ConfigService;
//# sourceMappingURL=config.service.js.map