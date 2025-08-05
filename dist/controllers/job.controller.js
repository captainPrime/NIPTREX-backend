"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const job_service_1 = tslib_1.__importDefault(require("../services/job.service"));
const users_service_1 = tslib_1.__importDefault(require("../services/users.service"));
const about_service_1 = tslib_1.__importDefault(require("../services/about.service"));
const HttpException_1 = require("../exceptions/HttpException");
const preference_service_1 = tslib_1.__importDefault(require("../services/preference.service"));
const skills_1 = require("../utils/skills");
const job_inteface_1 = require("../interfaces/job.inteface");
const bid_service_1 = tslib_1.__importDefault(require("../services/bid.service"));
const bid_model_1 = require("../models/bid.model");
class JobController {
    constructor() {
        this.jobService = new job_service_1.default();
        this.bidService = new bid_service_1.default();
        this.userService = new users_service_1.default();
        this.aboutService = new about_service_1.default();
        this.preferenceService = new preference_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Create Billing
        |--------------------------------------------------------------------------
        */
        this.createJob = async (req, res, next) => {
            try {
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const data = await this.jobService.createJob(Object.assign(Object.assign({}, req.body), { user_id: req.user.id }));
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Create Billing
        |--------------------------------------------------------------------------
        */
        this.updateJob = async (req, res, next) => {
            try {
                const body = req.body;
                const id = req.params.id;
                const data = await this.jobService.updateJob(id, body);
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get all Jobs
        |--------------------------------------------------------------------------
        */
        this.getAllJobs = async (req, res, next) => {
            try {
                const options = {
                    sortBy: req.query.sortBy || 'date_posted:desc',
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    projectBy: req.query.projectBy || 'name:hide, role:hide',
                };
                const data = await this.jobService.getAllJobs(req.query, options, req.user.id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get all Jobs
        |--------------------------------------------------------------------------
        */
        this.getFeaturedJobs = async (req, res, next) => {
            try {
                const options = {
                    sortBy: req.query.sortBy || 'date_posted:desc',
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    projectBy: req.query.projectBy || 'name:hide, role:hide',
                };
                const filter = { featured: true };
                const data = await this.jobService.getAllJobs(filter, options, req.user.id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get all Jobs
        |--------------------------------------------------------------------------
        */
        this.getAllSkillsCategory = async (req, res, next) => {
            try {
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data: skills_1.skills });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get all Jobs
        |--------------------------------------------------------------------------
        */
        this.getAllSkills = async (req, res, next) => {
            try {
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data: skills_1.skillsWithOutSection });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get all Jobs
        |--------------------------------------------------------------------------
        */
        this.technicalTools = async (req, res, next) => {
            try {
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data: skills_1.technicalTools });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get all Jobs
        |--------------------------------------------------------------------------
        */
        this.getAllSoftSkills = async (req, res, next) => {
            try {
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data: skills_1.softSkills });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | getUserJobBestMatches
        |--------------------------------------------------------------------------
        */
        this.getUserJobBestMatches = async (req, res, next) => {
            try {
                const jobQueries = [];
                const about = await this.aboutService.getUserAbout(req.user.id);
                if (about)
                    about === null || about === void 0 ? void 0 : about.skills.forEach((skill) => jobQueries.push(skill));
                const options = {
                    sortBy: req.query.sortBy || 'date_posted:desc',
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    projectBy: req.query.projectBy || 'name:hide, role:hide',
                };
                const data = await this.jobService.getUserJobBestMatches(jobQueries, req.user.id, req.query, options);
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | getMostRecentJobs
        |--------------------------------------------------------------------------
        */
        this.getMostRecentJobs = async (req, res, next) => {
            try {
                const jobQueries = [];
                const about = await this.aboutService.getUserAbout(req.user.id);
                if (!about)
                    throw new HttpException_1.HttpException(400, 2002, 'USER_NOT_FOUND');
                about.skills.forEach((skill) => jobQueries.push(skill));
                const options = {
                    sortBy: req.query.sortBy || 'date_posted:desc',
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    projectBy: req.query.projectBy || 'name:hide, role:hide',
                };
                const data = await this.jobService.getMostRecentJobs(jobQueries, req.user.id, req.query, options);
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | get similar jobs
        |--------------------------------------------------------------------------
        */
        this.getSimilarJobs = async (req, res, next) => {
            try {
                const jobQueries = [];
                const jobId = req.params.id;
                const jobs = await this.jobService.getJobByJobId(jobId);
                console.log('JOBS', jobs);
                if (jobs)
                    jobs === null || jobs === void 0 ? void 0 : jobs.jobs_tags.forEach((tag) => jobQueries.push(tag));
                // const options: PaginationOptions = {
                //   sortBy: req.query.sortBy || 'name:desc',
                //   limit: parseInt(req.query.limit as string, 10) || 10,
                //   page: parseInt(req.query.page as string, 10) || 1,
                //   projectBy: req.query.projectBy || 'name:hide, role:hide',
                // };
                const data = await this.jobService.getSimilarJobs(jobId, jobQueries);
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get JOB By Id
        |--------------------------------------------------------------------------
        */
        this.getJobById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.jobService.getJobById(id, req.user.id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get JOB By Id
        |--------------------------------------------------------------------------
        */
        this.getJobByClientId = async (req, res, next) => {
            try {
                const id = req.params.id;
                const options = {
                    sortBy: req.query.sortBy || 'createdAt:desc',
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    projectBy: req.query.projectBy || 'name:hide, role:hide',
                };
                const data = await this.jobService.getJobByClientId(id, req.query, options);
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        |getUserSavedJobs
        |--------------------------------------------------------------------------
        */
        this.getUserSavedJobs = async (req, res, next) => {
            try {
                const data = await this.jobService.getUserSavedJobs(req.user.id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        |getUserSavedJobs
        |--------------------------------------------------------------------------
        */
        this.getUserSavedItems = async (req, res, next) => {
            try {
                const data = await this.jobService.getUserSavedItems(req.user.id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get JOB By Id
        |--------------------------------------------------------------------------
        */
        this.savedJob = async (req, res, next) => {
            try {
                const id = req.params.id;
                const job = await this.jobService.getJobByJobId(id);
                if (!job)
                    throw new HttpException_1.HttpException(400, 2002, 'JOB_NOT_FOUND');
                const saveJob = await this.jobService.getSavedJobById(job._id.toString());
                if (saveJob.length !== 0)
                    throw new HttpException_1.HttpException(400, 5002, 'JOB_ALREAD_ADDED');
                const payload = {
                    user_id: req.user.id,
                    job: job._id.toString(),
                };
                const data = await this.jobService.savedJob(payload);
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get JOB By Id
        |--------------------------------------------------------------------------
        */
        this.unSaveJob = async (req, res, next) => {
            try {
                const id = req.params.id;
                await this.jobService.deleteSavedJob(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL' });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Hire Freelancer
        |--------------------------------------------------------------------------
        */
        this.hireFreelancer = async (req, res, next) => {
            try {
                const user_id = req.params.id;
                const job = await this.jobService.getJobByJobId(req.body.job_id);
                if (!job)
                    throw new HttpException_1.HttpException(400, 2002, 'JOB_NOT_FOUND');
                const proposal = await this.bidService.getProposalById(req.body.proposal);
                if (!proposal)
                    throw new HttpException_1.HttpException(400, 2002, 'PROPOSAL_NOT_FOUND');
                const payload = {
                    user_id,
                    job_id: job._id.toString(),
                    client_id: job.user_id.toString(),
                    proposal: req.body.proposal,
                };
                const data = await this.jobService.hireFreelancer(payload);
                // update job
                await this.jobService.updateJobById(job._id.toString(), {
                    status: job_inteface_1.JobStatus.TAKEN,
                    freelancer_id: user_id,
                    activities: { invites_sent: +1, interviewing: +1, unanswered_invites: +1 },
                });
                // return user nips
                const bidders = await this.bidService.getAllBidders(job._id.toString());
                const userIds = bidders.filter((bidder) => bidder.user_id.toString() !== user_id).map((bidder) => bidder.user_id.toString());
                await this.bidService.updateBid(user_id, job._id.toString(), { status: bid_model_1.BiddingStatus.IN_PROGRESS });
                userIds.forEach(async (userId) => {
                    await this.aboutService.updateAboutById(userId, { nips: +5 });
                    await this.bidService.updateBid(userId, job._id.toString(), { status: bid_model_1.BiddingStatus.CLOSED });
                });
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Hire Freelancer
        |--------------------------------------------------------------------------
        */
        this.getFreelancerContracts = async (req, res, next) => {
            var _a;
            try {
                const userId = (_a = req.query.id) !== null && _a !== void 0 ? _a : req.user.id;
                const jobQueries = [];
                const about = await this.aboutService.getUserAbout(userId);
                if (!about)
                    throw new HttpException_1.HttpException(400, 2002, 'USER_NOT_FOUND');
                about.skills.forEach((skill) => jobQueries.push(skill));
                const options = {
                    sortBy: req.query.sortBy || 'date_applied:desc',
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    search: req.query.search || '',
                    projectBy: req.query.projectBy || 'name:hide, role:hide',
                    populate: 'job_id,user_id',
                };
                const job = await this.jobService.getFreelancerContracts(userId, req.query, options);
                if (!job)
                    throw new HttpException_1.HttpException(400, 2002, 'JOB_NOT_FOUND');
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data: job });
            }
            catch (error) {
                next(error);
            }
        };
        this.getFreelancerContractsById = async (req, res, next) => {
            try {
                const contractId = req.params.id;
                const userId = req.user.id;
                if (!contractId)
                    throw new HttpException_1.HttpException(400, 2003, 'CONTRACT_ID_REQUIRED');
                const contract = await this.jobService.getFreelancerContractById(userId, contractId);
                if (!contract)
                    throw new HttpException_1.HttpException(404, 2004, 'CONTRACT_NOT_FOUND');
                res.status(200).json({
                    status: 200,
                    response_code: 3000,
                    message: 'CONTRACT_FETCH_SUCCESS',
                    data: contract,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getFreelancerContractsByIdClient = async (req, res, next) => {
            try {
                const proposalId = req.params.proposal_id;
                const userId = req.params.freelancer_id;
                if (!proposalId)
                    throw new HttpException_1.HttpException(400, 2003, 'PROPOSAL_ID_REQUIRED');
                const contract = await this.jobService.getFreelancerContractByIdClient(userId, proposalId);
                if (!contract)
                    throw new HttpException_1.HttpException(404, 2004, 'PROPOSAL_NOT_FOUND');
                res.status(200).json({
                    status: 200,
                    response_code: 3000,
                    message: 'CONTRACT_FETCH_SUCCESS',
                    data: contract,
                });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Freelance Work History
        |--------------------------------------------------------------------------
        */
        this.freelanceWorkHistory = async (req, res, next) => {
            var _a;
            try {
                const id = (_a = req.query.id) !== null && _a !== void 0 ? _a : req.user.id;
                const options = {
                    sortBy: req.query.sortBy || 'name:desc',
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    projectBy: req.query.projectBy || 'name:hide, role:hide',
                    populate: 'job_id,proposal',
                };
                const data = await this.jobService.freelanceWorkHistory(id, req.query, options);
                res.status(200).json({ status: 200, response_code: 3000, message: 'JOB_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = JobController;
//# sourceMappingURL=job.controller.js.map