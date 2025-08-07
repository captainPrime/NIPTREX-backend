"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = require("@utils/util");
const users_service_1 = tslib_1.__importDefault(require("./users.service"));
const HttpException_1 = require("@exceptions/HttpException");
const profile_validation_1 = require("@/validations/profile.validation");
const profile_model_1 = require("@/models/profile.model");
class ProfileService {
    constructor() {
        this.bio = profile_model_1.Bio;
        this.about = profile_model_1.About;
        this.bank = profile_model_1.BillingAddress;
        this.billing = profile_model_1.Billing;
        this.identity = profile_model_1.Identity;
        this.education = profile_model_1.Education;
        this.experience = profile_model_1.Experience;
        this.preference = profile_model_1.Preference;
        this.certification = profile_model_1.Certification;
        this.userService = new users_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Add Comment
        |--------------------------------------------------------------------------
        */
        // public async getProfileById(userId: mongoose.Types.ObjectId | string): Promise<any> {
        //   if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');
        //   const profile: any | null = await this.profile.findOne({ user_id: userId });
        //   if (!profile) throw new HttpException(400, 2002, 'PROFILE_NOT_FOUND');
        //   return profile;
        // }
        // /*
        // |--------------------------------------------------------------------------
        // | Add Comment
        // |--------------------------------------------------------------------------
        // */
        // public async updateProfile(userId: mongoose.Types.ObjectId | string, data: IUpdateProfile): Promise<any> {
        //   if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');
        //   const profile = await this.profile.findOne({ user_id: userId });
        //   if (!profile) throw new HttpException(400, 2002, 'PROFILE_NOT_FOUND');
        //   const updatedProfile = await this.profile.findByIdAndUpdate(profile._id, data, {
        //     new: true,
        //   });
        //   if (!updatedProfile) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        //   return updatedProfile;
        // }
    }
    /*
    |--------------------------------------------------------------------------
    | Add Comment
    |--------------------------------------------------------------------------
    */
    async getProfile(userId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 2005, "You're not userData");
        const findOneUserData = await this.userService.findUserById(userId);
        if (!findOneUserData)
            throw new HttpException_1.HttpException(400, 2002, 'PROFILE_NOT_FOUND');
        console.log('USER', findOneUserData);
        if (findOneUserData.user === 'client') {
            return findOneUserData;
        }
        const bio = await this.bio.findOne({ user_id: userId });
        const bank = await this.bank.findOne({ user_id: userId });
        const about = await this.about.findOne({ user_id: userId });
        const billing = await this.billing.find({ user_id: userId });
        const identity = await this.identity.find({ user_id: userId });
        const education = await this.education.find({ user_id: userId });
        const experience = await this.experience.find({ user_id: userId });
        const preference = await this.preference.find({ user_id: userId });
        const certification = await this.certification.find({ user_id: userId });
        // Define a function to calculate the percentage of profile completion
        const calculateProfileCompletion = (userProfile) => {
            let completion = 0;
            if (userProfile.personal_details)
                completion += 10;
            if (userProfile.address)
                completion += 10;
            if (userProfile.social_links)
                completion += 10;
            if (userProfile.languages)
                completion += 10;
            if (userProfile.work_preferences)
                completion += 10;
            if (userProfile.education_history.length !== 0)
                completion += 10;
            if (userProfile.experience.length !== 0)
                completion += 10;
            if (userProfile.certification.length !== 0)
                completion += 10;
            if (userProfile.proof_of_identity)
                completion += 10;
            if (userProfile.billing)
                completion += 10;
            return `${completion}%`;
        };
        const profile = {
            user_id: userId,
            first_name: findOneUserData.first_name,
            last_name: findOneUserData.last_name,
            role: findOneUserData.role,
            total_earnings: about === null || about === void 0 ? void 0 : about.total_earnings,
            total_jobs: about === null || about === void 0 ? void 0 : about.total_jobs,
            available: about === null || about === void 0 ? void 0 : about.available,
            nips: about === null || about === void 0 ? void 0 : about.nips,
            personal_details: about === null || about === void 0 ? void 0 : about.personal_details,
            address: about === null || about === void 0 ? void 0 : about.address,
            skills: about === null || about === void 0 ? void 0 : about.skills,
            resume: about === null || about === void 0 ? void 0 : about.resume,
            available_to_work: about === null || about === void 0 ? void 0 : about.available_to_work,
            social_links: about === null || about === void 0 ? void 0 : about.social_links,
            languages: about === null || about === void 0 ? void 0 : about.languages,
            rating: findOneUserData.rating,
            referral_code: findOneUserData.referral_code,
            bio: bio,
            work_preferences: preference[0],
            education_history: education,
            experience,
            certification,
            proof_of_identity: identity[0],
            billing: billing[0],
            billing_address: bank,
            created_at: findOneUserData.createdAt,
            updated_at: findOneUserData.updatedAt,
        };
        console.log(about);
        const profile_percentage = calculateProfileCompletion(profile);
        return { profile_percentage, profile };
    }
    async getDirectProfile(userId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 2005, "You're not userData");
        const findOneUserData = await this.userService.findUserById(userId);
        if (!findOneUserData)
            throw new HttpException_1.HttpException(400, 2002, 'PROFILE_NOT_FOUND');
        return findOneUserData;
    }
    /*
    |--------------------------------------------------------------------------
    | Create Experience
    |--------------------------------------------------------------------------
    */
    async createExperience(body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 2005, "You're not userData");
        const { error } = profile_validation_1.experienceValidation.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.experience.create(body);
        await this.userService.updateUser(data.user_id, { has_profile: true, has_experience: true });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get User Experience
    |--------------------------------------------------------------------------
    */
    async getUserExperience(userId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 2001, 'User id can not be empty');
        const data = await this.experience.find({ user_id: userId });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'PROFILE_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Experience By Id
    |--------------------------------------------------------------------------
    */
    async getExperienceById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.experience.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'PROFILE_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Update Experience By Id
    |--------------------------------------------------------------------------
    */
    async updateExperienceById(id, body) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.experience.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'EXPERIENCE_NOT_FOUND');
        const updatedData = await this.experience.findByIdAndUpdate(data._id, body, {
            new: true,
        });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        return updatedData;
    }
    /*
    |--------------------------------------------------------------------------
    | Delete Experience
    |--------------------------------------------------------------------------
    */
    async deleteExperience(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.experience.findByIdAndDelete(id);
        if (!data)
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        return data;
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
exports.default = ProfileService;
//# sourceMappingURL=profile.service.js.map