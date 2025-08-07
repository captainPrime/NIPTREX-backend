"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortListProposalModel = exports.ArchiveProposalModel = exports.BiddingModel = exports.PaymentType = exports.BiddingStatus = exports.MilestoneStatus = void 0;
const paginate_1 = require("@/modules/paginate");
const mongoose_1 = require("mongoose");
var MilestoneStatus;
(function (MilestoneStatus) {
    MilestoneStatus["PENDING"] = "pending";
    MilestoneStatus["IN_PROGRESS"] = "in_progress";
    MilestoneStatus["COMPLETED"] = "completed";
    MilestoneStatus["PAID"] = "paid";
})(MilestoneStatus = exports.MilestoneStatus || (exports.MilestoneStatus = {}));
var BiddingStatus;
(function (BiddingStatus) {
    BiddingStatus["NULL"] = "null";
    BiddingStatus["PAID"] = "paid";
    BiddingStatus["CLOSED"] = "closed";
    BiddingStatus["APPLIED"] = "applied";
    BiddingStatus["COMPLETED"] = "completed";
    BiddingStatus["IN_PROGRESS"] = "in_progress";
})(BiddingStatus = exports.BiddingStatus || (exports.BiddingStatus = {}));
var PaymentType;
(function (PaymentType) {
    PaymentType["OUTRIGHT"] = "outright";
    PaymentType["MILESTONE"] = "milestone";
})(PaymentType = exports.PaymentType || (exports.PaymentType = {}));
const BiddingSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    job_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Job', required: true },
    payment_type: {
        type: String,
        required: true,
        enum: Object.values(PaymentType),
    },
    milestone_stage: {
        type: [
            {
                description: {
                    type: String,
                    required: true,
                },
                status: {
                    type: String,
                    required: true,
                    enum: Object.values(MilestoneStatus),
                    default: MilestoneStatus.PENDING,
                },
                dueDate: {
                    type: Date,
                    required: true,
                },
                amount: {
                    type: Number,
                    required: true,
                },
                attachments: {
                    type: [String],
                },
                links: {
                    type: [String],
                },
            },
        ],
        required: function () {
            return this.payment_type === PaymentType.MILESTONE;
        },
    },
    outright_status: {
        type: String,
        required: true,
        enum: Object.values(BiddingStatus),
    },
    cover_letter: {
        type: String,
        required: true,
    },
    attachments: {
        type: [String],
    },
    links: {
        type: [String],
    },
    total_price_of_project: {
        type: Number,
        required: true,
    },
    service_fee: {
        type: Number,
        required: true,
    },
    amount_to_be_received: {
        type: Number,
        required: true,
    },
    bidding_amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(BiddingStatus),
        default: BiddingStatus.APPLIED,
    },
    date_applied: {
        type: Date,
        default: Date.now,
    },
    liked: {
        type: Boolean,
        default: false,
    },
    disliked: {
        type: Boolean,
        default: false,
    },
});
const ArchiveProposalSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    client_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    proposal: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Bidding', required: true },
}, {
    timestamps: true,
});
const ShortListProposalSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    client_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    proposal: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Bidding', required: true },
}, {
    timestamps: true,
});
BiddingSchema.plugin(paginate_1.paginate);
ArchiveProposalSchema.plugin(paginate_1.paginate);
ShortListProposalSchema.plugin(paginate_1.paginate);
const BiddingModel = (0, mongoose_1.model)('Bidding', BiddingSchema);
exports.BiddingModel = BiddingModel;
const ArchiveProposalModel = (0, mongoose_1.model)('ArchiveProposal', ArchiveProposalSchema);
exports.ArchiveProposalModel = ArchiveProposalModel;
const ShortListProposalModel = (0, mongoose_1.model)('ShortListProposal', ShortListProposalSchema);
exports.ShortListProposalModel = ShortListProposalModel;
//# sourceMappingURL=bid.model.js.map