"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const HttpException_1 = require("../exceptions/HttpException");
const util_1 = require("../utils/util");
const users_service_1 = tslib_1.__importDefault(require("./users.service"));
const profile_model_1 = require("../models/profile.model");
const profile_validation_1 = require("../validations/profile.validation");
class BioService {
    constructor() {
        this.bio = profile_model_1.Bio;
        this.userService = new users_service_1.default();
    }
    /*
    |--------------------------------------------------------------------------
    | Create Bio
    |--------------------------------------------------------------------------
    */
    async createBio(body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 2005, 'All required fields cannot be empty');
        const { error } = profile_validation_1.bioSchemaValidation.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.bio.create(body);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get User Bio
    |--------------------------------------------------------------------------
    */
    async getUserBio(userId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 2001, 'User id can not be empty');
        const data = await this.bio.find({ user_id: userId });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'BIO_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Bio By Id
    |--------------------------------------------------------------------------
    */
    async getBioById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.bio.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'BIO_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Update Bio By Id
    |--------------------------------------------------------------------------
    */
    async updateBioById(id, body) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const { error } = profile_validation_1.bioSchemaUpdateValidation.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.bio.findOne({ user_id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'BIO_NOT_FOUND');
        const updatedData = await this.bio.findByIdAndUpdate(data._id, body, {
            new: true,
        });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        return updatedData;
    }
    /*
    |--------------------------------------------------------------------------
    | Delete Bio
    |--------------------------------------------------------------------------
    */
    async deleteBio(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.bio.findByIdAndDelete(id);
        if (!data)
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        return data;
    }
}
exports.default = BioService;
//# sourceMappingURL=bio.service.js.map