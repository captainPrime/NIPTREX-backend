"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const HttpException_1 = require("../exceptions/HttpException");
const util_1 = require("../utils/util");
const users_service_1 = tslib_1.__importDefault(require("./users.service"));
const profile_model_1 = require("../models/profile.model");
const profile_validation_1 = require("../validations/profile.validation");
class CertificationService {
    constructor() {
        this.userService = new users_service_1.default();
        this.certification = profile_model_1.Certification;
    }
    /*
    |--------------------------------------------------------------------------
    | Create Certification
    |--------------------------------------------------------------------------
    */
    async createCertification(body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 2005, "You're not userData");
        const { error } = profile_validation_1.certificationSchema.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.certification.create(body);
        await this.userService.updateUser(data.user_id, { has_certification: true });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get User Certification
    |--------------------------------------------------------------------------
    */
    async getUserCertification(userId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 2001, 'User id can not be empty');
        const data = await this.certification.find({ user_id: userId });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'CERTIFICATION_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Certification By Id
    |--------------------------------------------------------------------------
    */
    async getCertificationById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.certification.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'CERTIFICATION_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Update Certification By Id
    |--------------------------------------------------------------------------
    */
    async updateCertificationById(id, body) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const { error } = profile_validation_1.certificationUpdateSchema.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.certification.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'CERTIFICATION_NOT_FOUND');
        const updatedData = await this.certification.findByIdAndUpdate(data._id, body, {
            new: true,
        });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        return updatedData;
    }
    /*
    |--------------------------------------------------------------------------
    | Delete Certification
    |--------------------------------------------------------------------------
    */
    async deleteCertification(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.certification.findByIdAndDelete(id);
        if (!data)
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        return data;
    }
}
exports.default = CertificationService;
//# sourceMappingURL=certification.service.js.map