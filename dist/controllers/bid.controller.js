"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bid_service_1 = tslib_1.__importDefault(require("../services/bid.service"));
const job_service_1 = tslib_1.__importDefault(require("../services/job.service"));
const users_service_1 = tslib_1.__importDefault(require("../services/users.service"));
const about_service_1 = tslib_1.__importDefault(require("../services/about.service"));
const HttpException_1 = require("../exceptions/HttpException");
const bid_model_1 = require("../models/bid.model");
class BidController {
    constructor() {
        this.bidService = new bid_service_1.default();
        this.jobService = new job_service_1.default();
        this.userService = new users_service_1.default();
        this.aboutService = new about_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Bid Job
        |--------------------------------------------------------------------------
        */
        this.bidJob = async (req, res, next) => {
            try {
                const userData = req.body;
                const id = req.params.id;
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const bidJob = await this.bidService.getBidByJob(id);
                if (bidJob && bidJob.user_id.toString() === user.id)
                    throw new HttpException_1.HttpException(400, 4002, 'JOB_ALREAD_BIDDED');
                const about = await this.aboutService.getUserAbout(user.id);
                if (!about) {
                    throw new HttpException_1.HttpException(400, 1005, 'PROFILE_NOT_COMPLETED');
                }
                if (about.nips < userData.bidding_amount)
                    throw new HttpException_1.HttpException(400, 4003, 'INSUFFICIENT_NIPS_TO_BID');
                const data = await this.bidService.bidJob(Object.assign(Object.assign({}, userData), { user_id: user.id, job_id: id, outright_status: req.body.payment_type === bid_model_1.PaymentType.OUTRIGHT ? bid_model_1.BiddingStatus.APPLIED : bid_model_1.BiddingStatus.NULL }));
                await this.aboutService.updateAboutById(user.id, { nips: about.nips - userData.bidding_amount });
                // update job
                await this.jobService.updateJobById(id, { activities: { proposals: +1 } });
                res.status(200).json({ status: 200, response_code: 4000, message: 'BID_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Bio By Id
        |--------------------------------------------------------------------------
        */
        this.getTopBidders = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.bidService.getTopBidders(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Bio By Id
        |--------------------------------------------------------------------------
        */
        this.getBidders = async (req, res, next) => {
            try {
                const id = req.params.id;
                const options = {
                    sortBy: 'createdAt:asc',
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    // projectBy: req.query.projectBy || 'name:hide, role:hide',
                };
                const data = await this.bidService.getBidders(id, options);
                res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Bio By Id
        |--------------------------------------------------------------------------
        */
        this.updateMilestone = async (req, res, next) => {
            try {
                const proposalId = req.params.proposalId;
                const milestoneId = req.params.milestoneId;
                const data = await this.bidService.updateMilestoneById(proposalId, milestoneId, req.body);
                res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Bio By Id
        |--------------------------------------------------------------------------
        */
        this.updateOutrightStatus = async (req, res, next) => {
            try {
                const proposalId = req.params.proposalId;
                const data = await this.bidService.updateOutrightStatus(proposalId, req.body);
                res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Bio By Id
        |--------------------------------------------------------------------------
        */
        this.getProposalById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.bidService.getProposalById(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Like a proposal
        |--------------------------------------------------------------------------
        */
        this.likeProposal = async (req, res, next) => {
            try {
                const proposalId = req.params.id;
                // const userId: string = req.user.id;
                const data = await this.bidService.likeProposal(proposalId);
                res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | DisLike A Proposal
        |--------------------------------------------------------------------------
        */
        this.dislikeProposal = async (req, res, next) => {
            try {
                const proposalId = req.params.id;
                // const userId: string = req.user.id;
                const data = await this.bidService.dislikeProposal(proposalId);
                res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Archive Proposal
        |--------------------------------------------------------------------------
        */
        this.archiveProposal = async (req, res, next) => {
            try {
                const proposalId = req.params.id;
                const proposal = await this.bidService.getBidById(proposalId);
                if (!proposal)
                    throw new HttpException_1.HttpException(400, 2002, 'PROPOSAL_NOT_FOUND');
                const archive = await this.bidService.getArchiveProposalById(proposal._id.toString());
                if (archive)
                    throw new HttpException_1.HttpException(400, 5002, 'PROPOSAL_ALREAD_ARCHIVED');
                const payload = {
                    user_id: proposal.user_id,
                    client_id: req.user.id,
                    proposal: proposal._id.toString(),
                };
                const data = await this.bidService.archiveProposal(payload);
                res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | getUserArchivedProposals
        |--------------------------------------------------------------------------
        */
        this.getUserArchivedProposals = async (req, res, next) => {
            try {
                const data = await this.bidService.getUserArchivedProposals(req.user.id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Archive Proposal
        |--------------------------------------------------------------------------
        */
        this.shortlistProposal = async (req, res, next) => {
            try {
                const proposalId = req.params.id;
                const proposal = await this.bidService.getBidById(proposalId);
                if (!proposal)
                    throw new HttpException_1.HttpException(400, 2002, 'PROPOSAL_NOT_FOUND');
                const archive = await this.bidService.getShortListById(proposal._id.toString());
                if (archive)
                    throw new HttpException_1.HttpException(400, 5002, 'PROPOSAL_ALREADY_SHORTLISTED');
                const payload = {
                    user_id: proposal.user_id,
                    client_id: req.user.id,
                    proposal: proposal._id.toString(),
                };
                const data = await this.bidService.shortListProposal(payload);
                res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | getUserArchivedProposals
        |--------------------------------------------------------------------------
        */
        this.getUserShortlistProposals = async (req, res, next) => {
            try {
                const data = await this.bidService.getUserShortLists(req.user.id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Bio By Id
        |--------------------------------------------------------------------------
        */
        this.requestMilestoneReview = async (req, res, next) => {
            try {
                const { proposal_id, milestone_id, client_id, proposal_type } = req.body;
                await this.bidService.requestMilestoneReview(proposal_id, milestone_id, client_id, req.user.id, proposal_type);
                res.status(200).json({ status: 200, response_code: 3000, message: 'BID_REQUEST_SUCCESSFUL', data: [] });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = BidController;
//# sourceMappingURL=bid.controller.js.map