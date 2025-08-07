"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOutrightStatusValidation = exports.updateMilestoneStageSchema = exports.updateBiddingSchemaValidation = exports.biddingSchemaValidation = void 0;
const tslib_1 = require("tslib");
const bid_model_1 = require("../models/bid.model");
const joi_1 = tslib_1.__importDefault(require("joi"));
exports.biddingSchemaValidation = joi_1.default.object({
    user_id: joi_1.default.string().required(),
    job_id: joi_1.default.string().required(),
    payment_type: joi_1.default.string()
        .valid(...Object.values(bid_model_1.PaymentType))
        .required(),
    milestone_stage: joi_1.default.when('paymentType', {
        is: bid_model_1.PaymentType.MILESTONE,
        then: joi_1.default.array()
            .items(joi_1.default.object({
            description: joi_1.default.string().required(),
            dueDate: joi_1.default.date().required(),
            status: joi_1.default.string()
                .required()
                .valid(...Object.values(bid_model_1.MilestoneStatus))
                .default(bid_model_1.MilestoneStatus.PENDING),
            amount: joi_1.default.number().required(),
            attachments: joi_1.default.array().items(joi_1.default.string()),
            links: joi_1.default.array().items(joi_1.default.string()),
        }))
            .required(),
    }),
    cover_letter: joi_1.default.string().required(),
    attachments: joi_1.default.array().items(joi_1.default.string()),
    links: joi_1.default.array().items(joi_1.default.string()),
    total_price_of_project: joi_1.default.number().required(),
    service_fee: joi_1.default.number().required(),
    amount_to_be_received: joi_1.default.number().required(),
    bidding_amount: joi_1.default.number().required(),
    status: joi_1.default.string()
        .valid(...Object.values(bid_model_1.BiddingStatus))
        .default(bid_model_1.BiddingStatus.APPLIED),
    outright_status: joi_1.default.string().valid(...Object.values(bid_model_1.BiddingStatus)),
    date_applied: joi_1.default.date().default(Date.now),
    liked: joi_1.default.boolean().default(false),
    disliked: joi_1.default.boolean().default(false),
});
exports.updateBiddingSchemaValidation = joi_1.default.object({
    user_id: joi_1.default.string(),
    job_id: joi_1.default.string(),
    payment_type: joi_1.default.string().valid(...Object.values(bid_model_1.PaymentType)),
    milestone_stage: joi_1.default.when('paymentType', {
        is: bid_model_1.PaymentType.MILESTONE,
        then: joi_1.default.array().items(joi_1.default.object({
            description: joi_1.default.string(),
            dueDate: joi_1.default.date(),
            status: joi_1.default.string()
                .valid(...Object.values(bid_model_1.MilestoneStatus))
                .default(bid_model_1.MilestoneStatus.PENDING),
            amount: joi_1.default.number(),
            attachments: joi_1.default.array().items(joi_1.default.string()),
            links: joi_1.default.array().items(joi_1.default.string()),
        })),
    }),
    cover_letter: joi_1.default.string(),
    attachments: joi_1.default.array().items(joi_1.default.string()),
    links: joi_1.default.array().items(joi_1.default.string()),
    total_price_of_project: joi_1.default.number(),
    service_fee: joi_1.default.number(),
    amount_to_be_received: joi_1.default.number(),
    bidding_amount: joi_1.default.number(),
    status: joi_1.default.string()
        .valid(...Object.values(bid_model_1.BiddingStatus))
        .default(bid_model_1.BiddingStatus.APPLIED),
    date_applied: joi_1.default.date().default(Date.now),
    liked: joi_1.default.boolean().default(false),
    disliked: joi_1.default.boolean().default(false),
}).min(1);
exports.updateMilestoneStageSchema = joi_1.default.object({
    description: joi_1.default.string().optional(),
    status: joi_1.default.string()
        .valid(...Object.values(bid_model_1.MilestoneStatus))
        .optional(),
    dueDate: joi_1.default.date().optional(),
    amount: joi_1.default.number().optional(),
    attachments: joi_1.default.array().items(joi_1.default.string()).optional(),
    links: joi_1.default.array().items(joi_1.default.string()).optional(),
}).min(1);
exports.updateOutrightStatusValidation = joi_1.default.object({
    description: joi_1.default.string().optional(),
    outright_status: joi_1.default.string()
        .valid(...Object.values(bid_model_1.MilestoneStatus))
        .optional(),
}).min(1);
//# sourceMappingURL=bid.validation.js.map