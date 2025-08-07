"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const HttpException_1 = require("@exceptions/HttpException");
const util_1 = require("@utils/util");
const users_service_1 = tslib_1.__importDefault(require("./users.service"));
const profile_model_1 = require("@/models/profile.model");
const profile_validation_1 = require("@/validations/profile.validation");
class EducationService {
    constructor() {
        this.education = profile_model_1.Education;
        this.userService = new users_service_1.default();
    }
    /*
    |--------------------------------------------------------------------------
    | Create Education
    |--------------------------------------------------------------------------
    */
    async createEducation(body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 2005, "You're not userData");
        const { error } = profile_validation_1.educationHistorySchema.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.education.create(body);
        await this.userService.updateUser(data.user_id, { has_education: true });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get User Education
    |--------------------------------------------------------------------------
    */
    async getUserEducation(userId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 2001, 'User id can not be empty');
        const data = await this.education.find({ user_id: userId });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'EDUCATION_HISTORY_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Education By Id
    |--------------------------------------------------------------------------
    */
    async getEducationById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.education.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'EDUCATION_HISTORY_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Update Education By Id
    |--------------------------------------------------------------------------
    */
    async updateEducationById(id, body) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const { error } = profile_validation_1.educationHistoryUpdateSchema.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.education.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'EDUCATION_HISTORY_NOT_FOUND');
        const updatedData = await this.education.findByIdAndUpdate(data._id, body, {
            new: true,
        });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        return updatedData;
    }
    /*
    |--------------------------------------------------------------------------
    | Delete Education
    |--------------------------------------------------------------------------
    */
    async deleteEducation(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.education.findByIdAndDelete(id);
        if (!data)
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        return data;
    }
}
exports.default = EducationService;
//# sourceMappingURL=education.service.js.map