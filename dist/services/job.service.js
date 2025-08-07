"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = require("@utils/util");
const users_model_1 = tslib_1.__importDefault(require("@/models/users.model"));
const users_service_1 = tslib_1.__importDefault(require("./users.service"));
const about_service_1 = tslib_1.__importDefault(require("./about.service"));
const HttpException_1 = require("@exceptions/HttpException");
const job_model_1 = require("@/models/job.model");
const matchPercentage_1 = require("@/utils/matchPercentage");
const job_validation_1 = require("@/validations/job.validation");
const bid_model_1 = require("@/models/bid.model");
class JobService {
    constructor() {
        this.hire = job_model_1.Hire;
        this.user = users_model_1.default;
        this.job = job_model_1.JobModel;
        this.bid = bid_model_1.BiddingModel;
        this.saveJob = job_model_1.SavedJob;
        this.userService = new users_service_1.default();
        this.aboutService = new about_service_1.default();
        this.capitalizeFirstLetter = (str) => {
            return str
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };
    }
    /*
    |--------------------------------------------------------------------------
    | Create Job
    |--------------------------------------------------------------------------
    */
    async createJob(body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 2005, 'Request body cannot be empty');
        const { error } = job_validation_1.jobSchemaValidation.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'JOB_VALIDATION_ERROR', [error.details[0].message]);
        // Capitalize job_title and job_description
        body.job_title = this.capitalizeFirstLetter(body.job_title);
        body.job_description = this.capitalizeFirstLetter(body.job_description);
        const data = await this.job.create(body);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Create Job
    |--------------------------------------------------------------------------
    */
    async updateJob(selector, body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 2005, 'Request body cannot be empty');
        const { error } = job_validation_1.jobSchemaUpdateValidation.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'JOB_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.job.findOne({ _id: selector });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'JOB_NOT_FOUND');
        const updatedPayload = Object.assign(Object.assign(Object.assign({}, data.toObject()), { activities: Object.assign(Object.assign({}, data.activities.toObject()), body.activities) }), body);
        const updatedData = await this.job.findByIdAndUpdate(data._id, updatedPayload, {
            new: true,
        });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        return updatedData;
    }
    /*
    |--------------------------------------------------------------------------
    | Create Job
    |--------------------------------------------------------------------------
    */
    async updateJobById(id, body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 2005, 'Request body cannot be empty');
        const { error } = job_validation_1.jobSchemaUpdateValidation.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'JOB_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.job.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'JOB_NOT_FOUND');
        const updatedPayload = Object.assign(Object.assign(Object.assign({}, data.toObject()), { activities: Object.assign(Object.assign({}, data.activities.toObject()), body.activities) }), body);
        const updatedData = await this.job.findByIdAndUpdate(data._id, updatedPayload, {
            new: true,
        });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        return updatedData;
    }
    /*
    |--------------------------------------------------------------------------
    | Save Job
    |--------------------------------------------------------------------------
    */
    async savedJob(payload) {
        const data = await this.saveJob.create(payload);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get User Job Best Matches
    |--------------------------------------------------------------------------
    */
    async getUserJobBestMatches(query, userId, otherQuery, options) {
        const regexTags = query.map((tag) => new RegExp(tag, 'i'));
        const filter = Object.assign({ jobs_tags: { $in: regexTags } }, otherQuery);
        const data = await this.job.paginate(filter, options);
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'JOB_NOT_FOUND');
        const savedJobIds = (await this.saveJob.find({ user_id: userId })).map((job) => job.job.toString());
        const updatedData = await Promise.all(data.results.map(async (job) => {
            const proposal = await this.bid.findOne({ job_id: job.id, user_id: userId });
            return Object.assign(Object.assign({}, job.toJSON()), { applied: !!proposal, is_saved: savedJobIds.includes(job._id.toString()) });
        }));
        return {
            results: updatedData,
            currentPage: data.currentPage,
            limit: data.limit,
            totalPages: data.totalPages,
            countOfFilteredDocuments: data.countOfFilteredDocuments,
            skip: data.skip,
            next: data.next,
            prev: data.prev,
        };
    }
    /*
    |--------------------------------------------------------------------------
    | Get User Job Best Matches
    |--------------------------------------------------------------------------
    */
    async getMostRecentJobs(query, userId, otherQuery, options) {
        const regexTags = query.map((tag) => new RegExp(tag, 'i'));
        const filter = Object.assign({ jobs_tags: { $in: regexTags } }, otherQuery);
        const data = await this.job.paginate(filter, options);
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'JOB_NOT_FOUND');
        const savedJobIds = (await this.saveJob.find({ user_id: userId })).map((job) => job.job.toString());
        const updatedData = await Promise.all(data.results.map(async (job) => {
            const proposal = await this.bid.findOne({ job_id: job.id, user_id: userId });
            return Object.assign(Object.assign({}, job.toJSON()), { applied: !!proposal, is_saved: savedJobIds.includes(job._id.toString()) });
        }));
        return {
            results: updatedData,
            currentPage: data.currentPage,
            limit: data.limit,
            totalPages: data.totalPages,
            countOfFilteredDocuments: data.countOfFilteredDocuments,
            skip: data.skip,
            next: data.next,
            prev: data.prev,
        };
    }
    /*
    |--------------------------------------------------------------------------
    | getAllJobs
    |--------------------------------------------------------------------------
    */
    async getAllJobs(filter, options, userId) {
        try {
            const data = await this.job.paginate(filter, options);
            if (!data) {
                throw new HttpException_1.HttpException(400, 2002, 'JOB_NOT_FOUND');
            }
            const savedJobIds = (await this.saveJob.find({ user_id: userId })).map((job) => job.job.toString());
            const updatedData = await Promise.all(data.results.map(async (job) => {
                const proposal = await this.bid.findOne({ job_id: job.id, user_id: userId });
                return Object.assign(Object.assign({}, job.toJSON()), { applied: !!proposal, is_saved: savedJobIds.includes(job._id.toString()) });
            }));
            console.log(data.next);
            return {
                results: updatedData,
                currentPage: data.currentPage,
                limit: data.limit,
                totalPages: data.totalPages,
                countOfFilteredDocuments: data.countOfFilteredDocuments,
                skip: data.skip,
                next: data.next,
                prev: data.prev,
            };
        }
        catch (error) {
            throw new HttpException_1.HttpException(400, 2002, error);
        }
    }
    /*
    |--------------------------------------------------------------------------
    | Get Job By Id
    |--------------------------------------------------------------------------
    */
    async getJobById(id, userId) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id cannot be empty');
        const data = await this.job.findOne({ _id: id }).populate({
            path: 'user_id',
            select: 'first_name last_name email phone_number country createdAt',
            options: {
                lean: true, // return plain JS objects instead of Mongoose documents
            },
            as: 'posted_by', // the name of the key to populate, defaults to the path
        });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'JOB_NOT_FOUND');
        const about = await this.aboutService.getUserAbout(userId);
        const savedJob = await this.saveJob.findOne({ user_id: userId, job: id });
        const proposal = await this.bid.findOne({ job_id: id, user_id: userId });
        // if (!proposal) throw new HttpException(400, 2002, 'PROPOSAL_NOT_FOUND');
        const updatedData = Object.assign(Object.assign({}, data.toJSON()), { is_saved: !!savedJob, applied: !!proposal, profile_match: (0, matchPercentage_1.calculateMatchPercentage)(about === null || about === void 0 ? void 0 : about.skills, data.jobs_tags) });
        return updatedData;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Similar Jobs
    |--------------------------------------------------------------------------
    */
    async getSimilarJobs(id, query) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id cannot be empty');
        const regexTags = query.map((tag) => new RegExp(tag, 'i'));
        const filter = {
            jobs_tags: { $in: regexTags },
            _id: { $ne: id },
        };
        const data = await this.job.find(filter);
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'JOB_NOT_FOUND');
        // const about = await this.aboutService.getUserAbout(userId);
        // const savedJob = await this.saveJob.findOne({ user_id: userId, job: id });
        // const updatedData = {
        //   ...data.toJSON(),
        //   is_saved: !!savedJob,
        //   profile_match: calculateMatchPercentage(about.skills, data.jobs_tags),
        // };
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Job By Id
    |--------------------------------------------------------------------------
    */
    async getJobByJobId(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'job id can not be empty');
        const data = await this.job.findOne({ _id: id });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Job By Id
    |--------------------------------------------------------------------------
    */
    async getJobByClientId(userId, otherQuery, options) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const filter = Object.assign({ user_id: userId }, otherQuery);
        const data = await this.job.paginate(filter, options);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Saved Job By Id
    |--------------------------------------------------------------------------
    */
    async getSavedJobById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.saveJob.find({ job: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'SAVED_JOB_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Saved Job By Id
    |--------------------------------------------------------------------------
    */
    async deleteSavedJob(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.saveJob.remove({ job: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'SAVED_JOB_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get User Saved Job
    |--------------------------------------------------------------------------
    */
    async getUserSavedJobs(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.saveJob.find({ user_id: id }).populate('job');
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'JOB_NOT_FOUND');
        const savedJobIds = (await this.saveJob.find({ user_id: id })).map((job) => job.job.toString());
        const updatedData = data.map((job) => {
            return Object.assign(Object.assign({}, job.toJSON()), { is_saved: savedJobIds.includes(job.job.id.toString()) });
        });
        return {
            results: updatedData,
            currentPage: data.currentPage,
            limit: data.limit,
            totalPages: data.totalPages,
            countOfFilteredDocuments: data.countOfFilteredDocuments,
            skip: data.skip,
            next: data.next,
            prev: data.prev,
        };
    }
    /*
    |--------------------------------------------------------------------------
    | Get User Saved Job
    |--------------------------------------------------------------------------
    */
    async getUserSavedItems(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.saveJob.find({ user_id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'SAVED_JOB_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Hire Freelancer
    |--------------------------------------------------------------------------
    */
    async hireFreelancer(payload) {
        if ((0, util_1.isEmpty)(payload))
            throw new HttpException_1.HttpException(400, 2001, 'payload can not be empty');
        const data = await this.hire.create(payload);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Work History
    |--------------------------------------------------------------------------
    */
    async freelanceWorkHistory(userId, otherQuery, options) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 2001, 'payload can not be empty');
        const filter = Object.assign({ user_id: userId.toString() }, otherQuery);
        const data = await this.hire.paginate(filter, options);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get All Freelance Contracts
    |--------------------------------------------------------------------------
    */
    async getFreelancerContracts(userId, otherQuery, options) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 2001, 'user id can not be empty');
        const filter = Object.assign({ user_id: userId.toString() }, otherQuery);
        const data = await this.bid.paginate(filter, options);
        // const results = await Promise.all(
        //   data.results.map(async (job: any) => {
        //     const user = await this.userService.get(job.user_id.toString());
        //     return { client_details: user, job_match };
        //   }),
        // );
        // return { ...data, results };
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Freelance Contracts By id
    |--------------------------------------------------------------------------
    */
    async getFreelancerContractById(userId, contractId) {
        var _a;
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 2001, 'USER_ID_REQUIRED');
        if ((0, util_1.isEmpty)(contractId))
            throw new HttpException_1.HttpException(400, 2003, 'CONTRACT_ID_REQUIRED');
        const contract = await this.bid
            .findOne({
            _id: contractId,
            user_id: userId, // ensures user owns it
        })
            .populate('job_id user_id'); // optional
        const clientId = (_a = contract.job_id) === null || _a === void 0 ? void 0 : _a.user_id;
        let clientDetails = null;
        if (clientId) {
            try {
                clientDetails = await this.userService.findUserById(clientId.toString());
            }
            catch (err) {
                console.warn(`Failed to fetch client details for ID: ${clientId}`, err);
            }
        }
        return Object.assign(Object.assign({}, contract.toObject()), { client_details: clientDetails });
    }
    async getFreelancerContractByIdClient(userId, contractId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 2001, 'USER_ID_REQUIRED');
        if ((0, util_1.isEmpty)(contractId))
            throw new HttpException_1.HttpException(400, 2003, 'CONTRACT_ID_REQUIRED');
        const contract = await this.bid
            .findOne({
            _id: contractId,
            user_id: userId, // ensures user owns it
        })
            .populate('job_id user_id'); // optional
        return contract;
    }
}
exports.default = JobService;
//# sourceMappingURL=job.service.js.map