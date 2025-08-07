"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProposalModel = exports.HireServiceModel = exports.ServiceModel = exports.ServiceProposalStatus = void 0;
const mongoose_1 = require("mongoose");
const toJSON_1 = require("@/modules/toJSON");
const paginate_1 = require("@/modules/paginate");
var ServiceProposalStatus;
(function (ServiceProposalStatus) {
    ServiceProposalStatus["NULL"] = "null";
    ServiceProposalStatus["PAID"] = "paid";
    ServiceProposalStatus["CLOSED"] = "closed";
    ServiceProposalStatus["APPLIED"] = "applied";
    ServiceProposalStatus["COMPLETED"] = "completed";
    ServiceProposalStatus["IN_PROGRESS"] = "in_progress";
})(ServiceProposalStatus = exports.ServiceProposalStatus || (exports.ServiceProposalStatus = {}));
const serviceSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    headline: { type: String, required: true },
    description: { type: String, required: true },
    projects: [
        {
            name: { type: String },
            url: { type: String },
        },
    ],
    category: [{ type: String, required: true }],
    services: [{ type: String, required: false }],
    tools: [{ type: String, required: false }],
    rating: {
        type: Number,
        required: false,
        default: 0,
    },
    price: {
        basic: {
            rate: { type: Number },
            duration: { type: Number },
            services: [{ type: String }],
        },
        standard: {
            rate: { type: Number },
            duration: { type: Number },
            services: [{ type: String }],
        },
        premium: {
            rate: { type: Number },
            duration: { type: Number },
            services: [{ type: String }],
        },
    },
    featured: { type: Boolean, required: false, default: false },
}, {
    timestamps: true,
});
const serviceProposalSchema = new mongoose_1.Schema({
    amount: { type: Number, required: true },
    delivery_date: { type: Date, required: true },
    package_type: { type: String, required: true },
    service_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Service', required: true },
    status: { type: String, enum: Object.values(ServiceProposalStatus), default: ServiceProposalStatus.APPLIED, required: true },
    client_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    service_buyer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});
const HireServiceSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Service', required: true },
    proposal: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ServiceProposal', required: true },
    status: { type: String, enum: Object.values(ServiceProposalStatus), default: ServiceProposalStatus.PAID, required: true },
    client: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    service_buyer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});
serviceSchema.plugin(toJSON_1.toJSON);
serviceSchema.plugin(paginate_1.paginate);
HireServiceSchema.plugin(paginate_1.paginate);
HireServiceSchema.plugin(toJSON_1.toJSON);
serviceProposalSchema.plugin(toJSON_1.toJSON);
serviceProposalSchema.plugin(paginate_1.paginate);
const ServiceModel = (0, mongoose_1.model)('Service', serviceSchema);
exports.ServiceModel = ServiceModel;
const HireServiceModel = (0, mongoose_1.model)('HireService', HireServiceSchema);
exports.HireServiceModel = HireServiceModel;
const ServiceProposalModel = (0, mongoose_1.model)('ServiceProposal', serviceProposalSchema);
exports.ServiceProposalModel = ServiceProposalModel;
//# sourceMappingURL=service.models.js.map