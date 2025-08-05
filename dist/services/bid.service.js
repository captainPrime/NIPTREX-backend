"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable security/detect-object-injection */
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const util_1 = require("../utils/util");
const job_service_1 = tslib_1.__importDefault(require("./job.service"));
const users_service_1 = tslib_1.__importDefault(require("./users.service"));
const about_service_1 = tslib_1.__importDefault(require("./about.service"));
const email_service_1 = tslib_1.__importDefault(require("../modules/email/email.service"));
const HttpException_1 = require("../exceptions/HttpException");
const matchPercentage_1 = require("../utils/matchPercentage");
const bid_validation_1 = require("../validations/bid.validation");
const bid_model_1 = require("../models/bid.model");
class BidService {
    constructor() {
        this.bid = bid_model_1.BiddingModel;
        this.jobService = new job_service_1.default();
        this.userService = new users_service_1.default();
        this.emailService = new email_service_1.default();
        this.aboutService = new about_service_1.default();
        this.archive = bid_model_1.ArchiveProposalModel;
        this.shortlist = bid_model_1.ShortListProposalModel;
    }
    /*
    |--------------------------------------------------------------------------
    | Bid Job
    |--------------------------------------------------------------------------
    */
    async bidJob(body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 2005, 'All required fields cannot be empty');
        const { error } = bid_validation_1.biddingSchemaValidation.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 4002, 'BID_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.bid.create(body);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Create Job
    |--------------------------------------------------------------------------
    */
    async updateBid(selector, job_id, body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 2005, 'Request body cannot be empty');
        const { error } = bid_validation_1.updateBiddingSchemaValidation.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'BID_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.bid.findOne({ user_id: selector, job_id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'BID_NOT_FOUND');
        const updatedPayload = Object.assign(Object.assign({}, data.toObject()), body);
        if (body.milestone_stage) {
            updatedPayload.milestone_stage = body.milestone_stage.map((milestone, index) => (Object.assign(Object.assign({}, data.milestone_stage[index].toObject()), milestone)));
        }
        const updatedData = await this.bid.findByIdAndUpdate(data._id, updatedPayload, { new: true });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 2009, 'BID_REQUEST_ERROR');
        return updatedData;
    }
    async updateMilestoneById(selector, milestoneId, milestoneData) {
        const { error } = bid_validation_1.updateMilestoneStageSchema.validate(milestoneData);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'BID_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.bid.findOne({ _id: new mongoose_1.default.Types.ObjectId(selector) });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'BID_NOT_FOUND');
        const milestoneIndex = data.milestone_stage.findIndex((item) => item._id.toString() === milestoneId);
        if (milestoneIndex === -1)
            throw new HttpException_1.HttpException(400, 2002, 'MILESTONE_NOT_FOUND');
        const updatedMilestones = data.milestone_stage.map((milestone) => {
            if (milestone._id.toString() === milestoneId) {
                return Object.assign(Object.assign({}, milestone.toObject()), milestoneData);
            }
            return milestone;
        });
        console.log('UPDATED', updatedMilestones);
        const updatedData = await this.bid.findByIdAndUpdate(data._id, { milestone_stage: updatedMilestones }, { new: true });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
        return updatedData;
    }
    async updateOutrightStatus(selector, milestoneData) {
        const { error } = bid_validation_1.updateOutrightStatusValidation.validate(milestoneData);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'BID_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.bid.findOne({ _id: new mongoose_1.default.Types.ObjectId(selector) });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'BID_NOT_FOUND');
        const updatedData = await this.bid.findByIdAndUpdate(data._id, { outright_status: milestoneData.outright_status }, { new: true });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 2009, 'BID_REQUEST_ERROR');
        return updatedData;
    }
    async requestMilestoneReview(proposalId, milestoneId, clientId, userId, proposal_type) {
        if ((0, util_1.isEmpty)(proposalId) || (0, util_1.isEmpty)(clientId) || (0, util_1.isEmpty)(proposal_type)) {
            throw new HttpException_1.HttpException(400, 4004, 'proposal_id, client_id and proposal_type are required.');
        }
        const data = await this.bid.findOne({ _id: new mongoose_1.default.Types.ObjectId(proposalId) });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'BID_NOT_FOUND');
        if (data.user_id != userId)
            throw new HttpException_1.HttpException(400, 2002, 'UNAUTHORIZE_USER');
        const user = await this.userService.findUserById(clientId);
        if (!user || user.user !== 'client')
            throw new HttpException_1.HttpException(400, 2002, 'CLIENT_NOT_FOUND');
        if (proposal_type == 'outright') {
            await this.emailService.sendOutrightReviewEmail(user.email, { proposalType: proposal_type }, user.first_name);
        }
        else {
            const milestoneIndex = data.milestone_stage.findIndex((item) => item._id.toString() === milestoneId);
            if (milestoneIndex === -1)
                throw new HttpException_1.HttpException(400, 2002, 'MILESTONE_NOT_FOUND');
            const milestoneData = data.milestone_stage[milestoneIndex];
            console.log('UPDATED', milestoneData);
            const payload = {
                milestoneDescription: milestoneData.description,
            };
            await this.emailService.sendMilestoneReviewEmail(user.email, payload, user.first_name);
        }
    }
    /*
    |--------------------------------------------------------------------------
    | getTopBidders
    |--------------------------------------------------------------------------
    */
    async getTopBidders(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 4004, 'id can not be empty');
        const data = await this.bid.find({ job_id: id }).sort({ bidding_amount: -1 }).limit(10).populate('user_id');
        if (!data)
            throw new HttpException_1.HttpException(400, 4003, 'BIDDERS_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | getAllBidders
    |--------------------------------------------------------------------------
    */
    async getAllBidders(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 4004, 'id canhh not be empty');
        const data = await this.bid.find({ job_id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 4003, 'BIDDERS_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | getTopBidders
    |--------------------------------------------------------------------------
    */
    async getBidders(id, options) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 4004, 'id can not be empty');
        const filter = {
            job_id: id,
        };
        const data = await this.bid.paginate(filter, options);
        data.results.sort((a, b) => {
            if (a.status === 'closed' && b.status !== 'closed') {
                return 1; // Move 'closed' status to the end
            }
            else if (a.status !== 'closed' && b.status === 'closed') {
                return -1; // Move 'closed' status to the end
            }
            else {
                // Sort by bidding_amount in descending order
                return b.bidding_amount - a.bidding_amount;
            }
        });
        if (!data)
            throw new HttpException_1.HttpException(400, 4003, 'BIDDERS_NOT_FOUND');
        const results = await Promise.all(data.results.map(async (job) => {
            const about = await this.aboutService.getUserAbout(job.user_id.toString());
            const job_data = await this.jobService.getJobByJobId(job.job_id.toString());
            const job_match = (0, matchPercentage_1.calculateMatchPercentage)(about.skills, job_data.jobs_tags);
            return { proposal: job, profile_details: about, job_match };
        }));
        return Object.assign(Object.assign({}, data), { results });
    }
    /*
    |--------------------------------------------------------------------------
    | getTopBidders
    |--------------------------------------------------------------------------
    */
    async getProposalById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 4004, 'id can not be empty');
        const data = await this.bid.findOne({ id });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | getTopBidders
    |--------------------------------------------------------------------------
    */
    async getAllProposal() {
        const data = await this.bid.find();
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Bid By Job
    |--------------------------------------------------------------------------
    */
    async getBidByJob(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.bid.findOne({ job_id: id });
        // if (!data) throw new HttpException(400, 2002, 'BID_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Bid By Id
    |--------------------------------------------------------------------------
    */
    async getBidById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.bid.findOne({ _id: id });
        // if (!data) throw new HttpException(400, 2002, 'BID_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Like Proposal
    |--------------------------------------------------------------------------
    */
    async likeProposal(proposalId) {
        if ((0, util_1.isEmpty)(proposalId))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const proposal = await this.bid.findOne({ id: proposalId });
        console.log(proposal);
        if (!proposal)
            throw new HttpException_1.HttpException(400, 2002, 'PROPOSAL_NOT_FOUND');
        if (proposal.liked === true)
            throw new HttpException_1.HttpException(400, 2002, 'PROPOSAL_ALREADY_LIKED');
        if (proposal.disliked === true)
            proposal.disliked = false;
        proposal.liked = true;
        await proposal.save();
        return proposal;
    }
    /*
    |--------------------------------------------------------------------------
    | DisLike Proposal
    |--------------------------------------------------------------------------
    */
    async dislikeProposal(proposalId) {
        if ((0, util_1.isEmpty)(proposalId))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const proposal = await this.bid.findOne({ id: proposalId });
        if (!proposal)
            throw new HttpException_1.HttpException(400, 2002, 'PROPOSAL_NOT_FOUND');
        if (proposal.disliked === true)
            throw new HttpException_1.HttpException(400, 2002, 'PROPOSAL_ALREADY_DISLIKED');
        if (proposal.liked === true)
            proposal.liked = false;
        proposal.disliked = true;
        await proposal.save();
        return proposal;
    }
    /*
    |--------------------------------------------------------------------------
    | Archive Proposal
    |--------------------------------------------------------------------------
    */
    async archiveProposal(payload) {
        const data = await this.archive.create(payload);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | ShortList Proposal
    |--------------------------------------------------------------------------
    */
    async shortListProposal(payload) {
        const data = await this.shortlist.create(payload);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Archive Proposal By Id
    |--------------------------------------------------------------------------
    */
    async getArchiveProposalById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.archive.findOne({ proposal: id });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get User Saved Job
    |--------------------------------------------------------------------------
    */
    async getUserArchivedProposals(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        try {
            const archive = await this.archive.find({ client_id: id }).lean().populate({ path: 'proposal' });
            if (!archive)
                throw new HttpException_1.HttpException(400, 2002, 'ARCHIVE_NOT_FOUND');
            // const archivedIds = (await this.archive.find({ client_id: id }).lean().select('proposal')).map((proposal: { proposal: any }) =>
            //   proposal.proposal.toString(),
            // );
            const results = await Promise.all(archive.map(async (archive) => {
                const about = await this.aboutService.getUserAbout(archive.user_id.toString());
                const job_data = await this.jobService.getJobByJobId(archive.proposal.job_id.toString());
                const job_match = (0, matchPercentage_1.calculateMatchPercentage)(about.skills, job_data.jobs_tags);
                return {
                    proposal: archive.proposal,
                    profile_details: about,
                    job_match,
                    // is_archived: archivedIds.includes(archive.proposal.job_id.toString()),
                };
            }));
            return results;
        }
        catch (error) {
            console.log(error);
            throw new HttpException_1.HttpException(500, 5000, 'Internal server error');
        }
    }
    /*
    |--------------------------------------------------------------------------
    | Get Archive Proposal By Id
    |--------------------------------------------------------------------------
    */
    async getShortListById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.shortlist.findOne({ proposal: id });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get User Saved Job
    |--------------------------------------------------------------------------
    */
    async getUserShortLists(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        try {
            const archive = await this.shortlist.find({ client_id: id }).lean().populate({ path: 'proposal' });
            if (!archive)
                throw new HttpException_1.HttpException(400, 2002, 'SHORTLIST_NOT_FOUND');
            // const archivedIds = (await this.archive.find({ client_id: id }).lean().select('proposal')).map((proposal: { proposal: any }) =>
            //   proposal.proposal.toString(),
            // );
            const results = await Promise.all(archive.map(async (archive) => {
                const about = await this.aboutService.getUserAbout(archive.user_id.toString());
                const job_data = await this.jobService.getJobByJobId(archive.proposal.job_id.toString());
                const job_match = (0, matchPercentage_1.calculateMatchPercentage)(about.skills, job_data.jobs_tags);
                return {
                    proposal: archive.proposal,
                    profile_details: about,
                    job_match,
                    // is_archived: archivedIds.includes(archive.proposal.job_id.toString()),
                };
            }));
            return results;
        }
        catch (error) {
            console.log(error);
            throw new HttpException_1.HttpException(500, 5000, 'Internal server error');
        }
    }
}
exports.default = BidService;
//# sourceMappingURL=bid.service.js.map