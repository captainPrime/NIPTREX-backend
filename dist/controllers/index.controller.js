"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// import Profile from '@/models/profile.model';
const bid_model_1 = require("@/models/bid.model");
const chat_model_1 = require("@/models/chat.model");
const job_model_1 = require("@/models/job.model");
const photography_model_1 = require("@/models/photography.model");
const profile_model_1 = require("@/models/profile.model");
const rating_model_1 = require("@/models/rating.model");
const service_models_1 = require("@/models/service.models");
const users_model_1 = tslib_1.__importDefault(require("@/models/users.model"));
const matchPercentage_1 = require("@/utils/matchPercentage");
class IndexController {
    constructor() {
        this.users = users_model_1.default;
        this.rating = rating_model_1.RatingModel;
        this.bid = bid_model_1.BiddingModel;
        this.job = job_model_1.JobModel;
        this.chat = chat_model_1.ChatModel;
        this.message = chat_model_1.MessageModel;
        this.hire = job_model_1.Hire;
        this.saveJob = job_model_1.SavedJob;
        this.about = profile_model_1.About;
        this.billing = profile_model_1.Billing;
        this.identity = profile_model_1.Identity;
        this.education = profile_model_1.Education;
        this.experience = profile_model_1.Experience;
        this.preference = profile_model_1.Preference;
        this.certification = profile_model_1.Certification;
        this.service = service_models_1.ServiceModel;
        this.serviceProposal = service_models_1.ServiceProposalModel;
        this.photography = photography_model_1.Photography;
        this.index = (req, res, next) => {
            try {
                res.status(200).json({
                    msg: 'Hello from App server',
                    Time: new Date(),
                    status: 'running',
                    server: 'Express + TS Server',
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.reloadDb = async (req, res, next) => {
            try {
                // await this.users.deleteMany({});
                // await this.about.deleteMany({});
                // await this.billing.deleteMany({});
                // await this.identity.deleteMany({});
                // await this.education.deleteMany({});
                // await this.experience.deleteMany({});
                // await this.preference.deleteMany({});
                // await this.certification.deleteMany({});
                // await this.job.deleteMany({});
                // await this.saveJob.deleteMany({});
                // await this.bid.deleteMany({});
                // await this.hire.deleteMany({});
                // await this.rating.deleteMany({});
                // await this.service.deleteMany({});
                // await this.chat.deleteMany({});
                // await this.serviceProposal.deleteMany({});
                // await this.message.deleteMany({});
                await this.photography.deleteMany({});
                const user = {
                    first_name: 'John',
                    last_name: 'Doe',
                    email: 'johndoe@gmail.com',
                    password: 'johndoe21',
                    user: 'client',
                    verified: true,
                    has_profile: false,
                    country: 'Nigeria',
                    referral_code: (0, matchPercentage_1.generateReferralCode)(8),
                };
                const user2 = {
                    first_name: 'John',
                    last_name: 'Doe',
                    email: 'freelancer@gmail.com',
                    password: 'freelancer',
                    user: 'freelancer',
                    verified: true,
                    has_profile: false,
                    country: 'Nigeria',
                    referral_code: (0, matchPercentage_1.generateReferralCode)(8),
                };
                const user3 = {
                    first_name: 'Freeman',
                    last_name: 'Doe',
                    email: 'freelancer2@gmail.com',
                    password: 'freelancer2',
                    user: 'freelancer',
                    verified: true,
                    has_profile: false,
                    country: 'Nigeria',
                    referral_code: (0, matchPercentage_1.generateReferralCode)(8),
                };
                // await this.users.create(user);
                // await this.users.create(user2);
                // await this.users.create(user3);
                res.status(200).json({ status: 200, response_code: 2000, message: 'DATABASE_RELOAD_SUCCESSFUL' });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = IndexController;
//# sourceMappingURL=index.controller.js.map