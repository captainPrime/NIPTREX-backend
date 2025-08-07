"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable security/detect-object-injection */
const HttpException_1 = require("@exceptions/HttpException");
const util_1 = require("@utils/util");
const users_service_1 = tslib_1.__importDefault(require("./users.service"));
const profile_model_1 = require("@/models/profile.model");
const profile_validation_1 = require("@/validations/profile.validation");
class AboutService {
    constructor() {
        this.about = profile_model_1.About;
        this.userService = new users_service_1.default();
    }
    /*
    |--------------------------------------------------------------------------
    | Create About
    |--------------------------------------------------------------------------
    */
    async createAbout(body) {
        var _a;
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 2005, "You're not userData");
        const { error } = profile_validation_1.aboutSchema.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.about.create(body);
        await this.userService.updateUser(data.user_id, { has_profile: true, has_about: true, profile_picture: (_a = body === null || body === void 0 ? void 0 : body.personal_details) === null || _a === void 0 ? void 0 : _a.profile_picture });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get User About
    |--------------------------------------------------------------------------
    */
    async getUserAbout(userId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 2001, 'User id can not be empty');
        const data = await this.about.findOne({ user_id: userId });
        // if (!data) throw new HttpException(400, 2002, 'ABOUT_NOT_FOUND');
        console.log('ABOUT', data);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get About By Id
    |--------------------------------------------------------------------------
    */
    async getAboutById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.about.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'ABOUT_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Update About By Id
    |--------------------------------------------------------------------------
    */
    async updateAboutById(id, body) {
        var _a, _b, _c;
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const user = await this.userService.findUserById(id);
        if (!user)
            throw new HttpException_1.HttpException(400, 2002, 'USER_NOT_FOUND');
        let updatedData;
        if (((_a = body.personal_details) === null || _a === void 0 ? void 0 : _a.profile_picture) && user.user === 'client') {
            updatedData = await this.userService.updateUser(id, { profile_picture: (_b = body.personal_details) === null || _b === void 0 ? void 0 : _b.profile_picture });
        }
        else {
            const { error } = profile_validation_1.updateAboutSchema.validate(body);
            if (error)
                throw new HttpException_1.HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);
            const data = await this.about.findOne({ user_id: id });
            if (!data)
                throw new HttpException_1.HttpException(400, 2002, 'ABOUT_NOT_FOUND');
            // Update the desired fields dynamically from the request body
            const updatedPayload = Object.assign(Object.assign({}, data.toObject()), { personal_details: Object.assign(Object.assign({}, data.personal_details.toObject()), body.personal_details), address: Object.assign(Object.assign({}, data.address.toObject()), body.address), total_earnings: body.total_earnings || data.total_earnings, total_jobs: body.total_jobs || data.total_jobs, available: body.available || data.available, nips: body.nips || data.nips, social_links: Object.assign(Object.assign({}, data.social_links.toObject()), body.social_details), languages: body.languages || data.languages, skills: body.skills || data.skills, available_to_work: body.available_to_work || data.available_to_work, resume: body.resume || data.resume });
            // Update the document with the updated payload
            updatedData = await this.about.findByIdAndUpdate(data._id, updatedPayload, { new: true });
            await this.userService.updateUser(id, { profile_picture: (_c = body.personal_details) === null || _c === void 0 ? void 0 : _c.profile_picture });
        }
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        return updatedData;
    }
    /*
    |--------------------------------------------------------------------------
    | Update About By Id
    |--------------------------------------------------------------------------
    */
    async updateResumeById(id, body, resumeId) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const { error } = profile_validation_1.updateResumeValidation.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);
        const about = await this.about.findOne({ user_id: id });
        if (!about)
            throw new HttpException_1.HttpException(400, 2002, 'ABOUT_NOT_FOUND');
        const resumeItem = about.resume.find((item) => item.id === resumeId);
        if (!resumeItem) {
            throw new HttpException_1.HttpException(400, 2002, 'RESUME_ITEM_NOT_FOUND');
        }
        resumeItem.name = body.name;
        resumeItem.url = body.url;
        // Update the document with the updated payload
        const updatedAbout = await this.about.findByIdAndUpdate(about._id, about, { new: true });
        if (!updatedAbout) {
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        }
        return updatedAbout;
    }
    async deleteResumeById(id, resumeId) {
        if ((0, util_1.isEmpty)(id)) {
            throw new HttpException_1.HttpException(400, 2001, 'id cannot be empty');
        }
        const about = await this.about.findOne({ user_id: id });
        if (!about) {
            throw new HttpException_1.HttpException(400, 2002, 'ABOUT_NOT_FOUND');
        }
        const resumeItemIndex = about.resume.findIndex((item) => item.id === resumeId);
        if (resumeItemIndex === -1) {
            throw new HttpException_1.HttpException(400, 2002, 'RESUME_ITEM_NOT_FOUND');
        }
        about.resume.splice(resumeItemIndex, 1);
        // Update the document with the updated payload
        const updatedAbout = await this.about.findByIdAndUpdate(about._id, about, { new: true });
        if (!updatedAbout) {
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        }
        return updatedAbout;
    }
    /*
    |--------------------------------------------------------------------------
    | Delete About
    |--------------------------------------------------------------------------
    */
    async deleteAbout(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.about.findByIdAndDelete(id);
        if (!data)
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        return data;
    }
}
exports.default = AboutService;
//# sourceMappingURL=about.service.js.map