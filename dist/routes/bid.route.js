"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const bid_controller_1 = tslib_1.__importDefault(require("../controllers/bid.controller"));
const job_controller_1 = tslib_1.__importDefault(require("../controllers/job.controller"));
const auth_middleware_1 = tslib_1.__importDefault(require("../middlewares/auth.middleware"));
class BidRoute {
    constructor() {
        this.path = '/bid';
        this.router = (0, express_1.Router)();
        this.bidController = new bid_controller_1.default();
        this.jobController = new job_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/proposals/archive`, (0, auth_middleware_1.default)(['client']), this.bidController.getUserArchivedProposals);
        this.router.get(`${this.path}/proposals/archive/:id`, (0, auth_middleware_1.default)(['client']), this.bidController.archiveProposal);
        this.router.get(`${this.path}/proposals/shortlist`, (0, auth_middleware_1.default)(['client']), this.bidController.getUserShortlistProposals);
        this.router.get(`${this.path}/proposals/shortlist/:id`, (0, auth_middleware_1.default)(['client']), this.bidController.shortlistProposal);
        this.router.get(`${this.path}/proposals/like/:id`, this.bidController.likeProposal);
        this.router.get(`${this.path}/proposals/dislike/:id`, this.bidController.dislikeProposal);
        this.router.get(`${this.path}/proposals/:id`, (0, auth_middleware_1.default)(['client']), this.bidController.getBidders);
        this.router.put(`${this.path}/updateMilestone/:proposalId/:milestoneId`, (0, auth_middleware_1.default)(['client']), this.bidController.updateMilestone);
        this.router.put(`${this.path}/updateOutrightStatus/:proposalId`, (0, auth_middleware_1.default)(['client']), this.bidController.updateOutrightStatus);
        this.router.put(`${this.path}/adminUpdateMilestone/:proposalId/:milestoneId`, (0, auth_middleware_1.default)(['admin']), this.bidController.updateMilestone);
        this.router.post(`${this.path}/requestMilestoneReview`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.bidController.requestMilestoneReview);
        this.router.get(`${this.path}/getProposalById/:id`, (0, auth_middleware_1.default)(['client']), this.bidController.getProposalById);
        this.router.get(`${this.path}/proposals/:id/dislike`, this.bidController.getBidders);
        this.router.get(`${this.path}/getTopBidders/:id`, this.bidController.getTopBidders);
        this.router.post(`${this.path}/:id`, (0, auth_middleware_1.default)(['freelancer']), this.bidController.bidJob);
        this.router.post(`${this.path}/hire/:id`, (0, auth_middleware_1.default)(['client']), this.jobController.hireFreelancer);
    }
}
exports.default = BidRoute;
//# sourceMappingURL=bid.route.js.map