"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const HttpException_1 = require("@exceptions/HttpException");
const util_1 = require("@utils/util");
const users_service_1 = tslib_1.__importDefault(require("./users.service"));
const profile_model_1 = require("@/models/profile.model");
const profile_validation_1 = require("@/validations/profile.validation");
class PreferenceService {
    constructor() {
        this.preference = profile_model_1.Preference;
        this.userService = new users_service_1.default();
    }
    /*
    |--------------------------------------------------------------------------
    | Create Preference
    |--------------------------------------------------------------------------
    */
    async createPreference(body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 2005, "You're not userData");
        const { error } = profile_validation_1.workPreferenceSchema.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.preference.create(body);
        await this.userService.updateUser(data.user_id, { has_work_preference: true });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get User Preference
    |--------------------------------------------------------------------------
    */
    async getUserPreference(userId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 2001, 'User id can not be empty');
        const data = await this.preference.find({ user_id: userId });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'PREFERENCE_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Preference By Id
    |--------------------------------------------------------------------------
    */
    async getPreferenceById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.preference.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'PREFERENCE_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Update Preference By Id
    |--------------------------------------------------------------------------
    */
    async updatePreferenceById(id, body) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const { error } = profile_validation_1.workPreferenceUpdateSchema.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.preference.findOne({ user_id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'PREFERENCE_NOT_FOUND');
        const updatedData = await this.preference.findByIdAndUpdate(data._id, body, {
            new: true,
        });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        return updatedData;
    }
    /*
    |--------------------------------------------------------------------------
    | Delete Preference
    |--------------------------------------------------------------------------
    */
    async deletePreference(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.preference.findByIdAndDelete(id);
        if (!data)
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        return data;
    }
}
exports.default = PreferenceService;
//# sourceMappingURL=preference.service.js.map