"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const auth_middleware_1 = tslib_1.__importDefault(require("@middlewares/auth.middleware"));
const about_controller_1 = tslib_1.__importDefault(require("@/controllers/about.controller"));
const profile_controller_1 = tslib_1.__importDefault(require("@/controllers/profile.controller"));
const billing_controller_1 = tslib_1.__importDefault(require("@/controllers/billing.controller"));
const identity_controller_1 = tslib_1.__importDefault(require("@/controllers/identity.controller"));
const education_controller_1 = tslib_1.__importDefault(require("@/controllers/education.controller"));
const preference_controller_1 = tslib_1.__importDefault(require("@/controllers/preference.controller"));
const certification_controller_1 = tslib_1.__importDefault(require("@/controllers/certification.controller"));
const bio_controller_1 = tslib_1.__importDefault(require("@/controllers/bio.controller"));
const job_controller_1 = tslib_1.__importDefault(require("@/controllers/job.controller"));
const bank_controller_1 = tslib_1.__importDefault(require("@/controllers/bank.controller"));
class ProfileRoute {
    constructor() {
        this.path = '/profile';
        this.router = (0, express_1.Router)();
        this.bioController = new bio_controller_1.default();
        this.jobController = new job_controller_1.default();
        this.bankController = new bank_controller_1.default();
        this.aboutController = new about_controller_1.default();
        this.billingController = new billing_controller_1.default();
        this.profileController = new profile_controller_1.default();
        this.identityController = new identity_controller_1.default();
        this.educationController = new education_controller_1.default();
        this.preferenceController = new preference_controller_1.default();
        this.certificationController = new certification_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.profileController.getDirectProfile);
        this.router.get(`${this.path}/details`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.profileController.getProfile);
        this.router.get(`${this.path}/getProfileByUserId`, this.profileController.getProfileByUserId);
        /*
        |--------------------------------------------------------------------------
        | Experience Route
        |--------------------------------------------------------------------------
        */
        this.router.post(`${this.path}/experience`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.profileController.createExperience);
        this.router.get(`${this.path}/experience`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.profileController.getUserExperience);
        this.router.put(`${this.path}/experience/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.profileController.updateExperience);
        this.router.delete(`${this.path}/experience/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.profileController.deleteExperience);
        this.router.get(`${this.path}/experience/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.profileController.getExperienceById);
        /*
        |--------------------------------------------------------------------------
        | Education Route
        |--------------------------------------------------------------------------
        */
        this.router.post(`${this.path}/education`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.educationController.createEducation);
        this.router.get(`${this.path}/education`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.educationController.getUserEducation);
        this.router.put(`${this.path}/education/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.educationController.updateEducation);
        this.router.delete(`${this.path}/education/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.educationController.deleteEducation);
        this.router.get(`${this.path}/education/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.educationController.getEducationById);
        /*
        |--------------------------------------------------------------------------
        | Certification Route
        |--------------------------------------------------------------------------
        */
        this.router.post(`${this.path}/certificate`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.certificationController.createCertification);
        this.router.get(`${this.path}/certificate`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.certificationController.getUserCertification);
        this.router.put(`${this.path}/certificate/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.certificationController.updateCertification);
        this.router.delete(`${this.path}/certificate/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.certificationController.deleteCertification);
        this.router.get(`${this.path}/certificate/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.certificationController.getCertificationById);
        /*
        |--------------------------------------------------------------------------
        | Billing Route
        |--------------------------------------------------------------------------
        */
        this.router.post(`${this.path}/billing`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.billingController.createBilling);
        this.router.get(`${this.path}/billing`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.billingController.getUserBilling);
        this.router.put(`${this.path}/billing`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.billingController.updateBilling);
        this.router.delete(`${this.path}/billing/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.billingController.deleteBilling);
        this.router.get(`${this.path}/billing/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.billingController.getBillingById);
        /*
        |--------------------------------------------------------------------------
        | Identity Route
        |--------------------------------------------------------------------------
        */
        this.router.post(`${this.path}/identity`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.identityController.createIdentity);
        this.router.get(`${this.path}/identity`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.identityController.getUserIdentity);
        this.router.put(`${this.path}/identity`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.identityController.updateIdentity);
        this.router.delete(`${this.path}/identity/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.identityController.deleteIdentity);
        this.router.get(`${this.path}/identity/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.identityController.getIdentityById);
        /*
        |--------------------------------------------------------------------------
        | Work Preference Route
        |--------------------------------------------------------------------------
        */
        this.router.post(`${this.path}/preference`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.preferenceController.createPreference);
        this.router.get(`${this.path}/preference`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.preferenceController.getUserPreference);
        this.router.put(`${this.path}/preference`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.preferenceController.updatePreference);
        this.router.delete(`${this.path}/preference/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.preferenceController.deletePreference);
        this.router.get(`${this.path}/preference/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.preferenceController.getPreferenceById);
        /*
        |--------------------------------------------------------------------------
        | About Route
        |--------------------------------------------------------------------------
        */
        this.router.post(`${this.path}/about`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.aboutController.createAbout);
        this.router.get(`${this.path}/about`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.aboutController.getUserAbout);
        this.router.put(`${this.path}/about`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.aboutController.updateAbout);
        this.router.delete(`${this.path}/about/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.aboutController.deleteAbout);
        this.router.put(`${this.path}/resume/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.aboutController.updateResumeById);
        this.router.delete(`${this.path}/resume/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.aboutController.deleteResumeById);
        this.router.get(`${this.path}/about/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.aboutController.getAboutById);
        /*
        |--------------------------------------------------------------------------
        | Bio Route
        |--------------------------------------------------------------------------
        */
        this.router.post(`${this.path}/bio`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.bioController.createBio);
        this.router.get(`${this.path}/bio`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.bioController.getUserBio);
        this.router.put(`${this.path}/bio`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.bioController.updateBio);
        this.router.delete(`${this.path}/bio/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.bioController.deleteBio);
        this.router.get(`${this.path}/bio/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.bioController.getBioById);
        /*
        |--------------------------------------------------------------------------
        | Bank Route
        |--------------------------------------------------------------------------
        */
        this.router.post(`${this.path}/billingAddress`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.bankController.createBank);
        this.router.get(`${this.path}/billingAddress`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.bankController.getUserBank);
        this.router.put(`${this.path}/billingAddress`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.bankController.updateBankInfo);
        this.router.delete(`${this.path}/billingAddress/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.bankController.deleteBankInfo);
        this.router.get(`${this.path}/billingAddress/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.bankController.getBankById);
        /*
        |--------------------------------------------------------------------------
        | Bio Route
        |--------------------------------------------------------------------------
        */
        this.router.get(`${this.path}/freelanceWorkHistory`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.jobController.freelanceWorkHistory);
    }
}
exports.default = ProfileRoute;
//# sourceMappingURL=profile.route.js.map