"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const service_models_1 = require("../models/service.models");
const email_service_1 = tslib_1.__importDefault(require("../modules/email/email.service"));
const service_validation_1 = require("../validations/service.validation");
const HttpException_1 = require("../exceptions/HttpException");
const util_1 = require("../utils/util");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const users_service_1 = tslib_1.__importDefault(require("./users.service"));
class ServiceService {
    constructor() {
        this.service = service_models_1.ServiceModel;
        this.userService = new users_service_1.default();
        this.emailService = new email_service_1.default();
        this.hireService = service_models_1.HireServiceModel;
        this.serviceProposal = service_models_1.ServiceProposalModel;
    }
    /*
    |--------------------------------------------------------------------------
    | Create Service
    |--------------------------------------------------------------------------
    */
    async createService(body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 2005, 'All required fields cannot be empty');
        const { error } = service_validation_1.serviceValidationSchema.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'SERVICE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.service.create(body);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get All Service
    |--------------------------------------------------------------------------
    */
    async getAllService(filter, options) {
        const data = await this.service.paginate(filter, options);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Service by ID
    |--------------------------------------------------------------------------
    */
    async getServiceById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'ID cannot be empty');
        const data = await this.service.findOne({ _id: id }).populate('user_id');
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'SERVICE_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Service by ID
    |--------------------------------------------------------------------------
    */
    async getServiceByUserId(options, filter) {
        // if (isEmpty(filter)) throw new HttpException(400, 2001, 'ID cannot be empty');
        const data = await this.service.paginate(filter, options);
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'SERVICE_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Update Service by ID
    |--------------------------------------------------------------------------
    */
    async updateServiceById(id, body) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'ID cannot be empty');
        const { error } = service_validation_1.serviceUpdateValidationSchema.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'SERVICE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.service.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 2002, 'SERVICE_NOT_FOUND');
        const updatedPayload = Object.assign(Object.assign(Object.assign({}, data.toObject()), { price: Object.assign(Object.assign({}, data.price), body.price) }), body);
        const updatedData = await this.service.findByIdAndUpdate(id, updatedPayload, {
            new: true,
        });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 2009, 'SERVICE_REQUEST_ERROR');
        return updatedData;
    }
    /*
    |--------------------------------------------------------------------------
    | Delete Service by ID
    |--------------------------------------------------------------------------
    */
    async deleteService(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'ID cannot be empty');
        const data = await this.service.findByIdAndDelete(id);
        if (!data)
            throw new HttpException_1.HttpException(400, 2009, 'SERVICE_REQUEST_ERROR');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Hire Service
    |--------------------------------------------------------------------------
    */
    async hireFreelancerService(payload) {
        if ((0, util_1.isEmpty)(payload))
            throw new HttpException_1.HttpException(400, 2001, 'payload can not be empty');
        const data = await this.hireService.create(payload);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | getAppliedServices
    |--------------------------------------------------------------------------
    */
    async getAppliedServices(userId, options) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 2001, 'payload can not be empty');
        const filter = {
            client: userId.toString(),
            status: service_models_1.ServiceProposalStatus.PAID,
        };
        const data = await this.hireService.paginate(filter, options);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Hire Service
    |--------------------------------------------------------------------------
    */
    async createServiceProposal(payload) {
        if ((0, util_1.isEmpty)(payload))
            throw new HttpException_1.HttpException(400, 2001, 'payload can not be empty');
        const data = await this.serviceProposal.create(payload);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Service Proposal By Id
    |--------------------------------------------------------------------------
    */
    async getServiceProposalByIdInternal(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.serviceProposal.findOne({ _id: id });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Service Proposal By Id
    |--------------------------------------------------------------------------
    */
    async getServiceProposalById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.serviceProposal.findOne({ _id: id }).populate({
            path: 'client_id',
            select: 'first_name last_name profile_picture',
        });
        console.log('first proposal:', this.serviceProposal.findOne({ _id: id }));
        console.log('second proposal:', data);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Service Proposal By Id
    |--------------------------------------------------------------------------
    */
    async getServiceProposalByServiceId(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.serviceProposal.findOne({ service_id: id }).populate({
            path: 'client_id',
            select: 'first_name last_name profile_picture',
        });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Service Proposal By Id
    |--------------------------------------------------------------------------
    */
    async getAllServiceProposalByServiceId(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.serviceProposal.find({ service_id: id }).populate({
            path: 'client_id',
            select: 'first_name last_name profile_picture',
        });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get All Service Proposal
    |--------------------------------------------------------------------------
    */
    async getAllServiceProposal(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.serviceProposal.find({ service_id: id }).populate({
            path: 'client_id',
            select: 'first_name last_name profile_picture',
        });
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Update Service by ID
    |--------------------------------------------------------------------------
    */
    async updateServiceProjectById(id, body) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'ID cannot be empty');
        const { error } = service_validation_1.updateServiceProposalStatusValidation.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'SERVICE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.serviceProposal.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 7002, 'SERVICE_PROPOSAL_NOT_FOUND');
        const updatedData = await this.serviceProposal.findByIdAndUpdate(id, body, {
            new: true,
        });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 2009, 'SERVICE_REQUEST_ERROR');
        return updatedData;
    }
    /*
    |--------------------------------------------------------------------------
    | Request Service Review
    |--------------------------------------------------------------------------
    */
    async requestServiceReview(proposalId, clientId, userId) {
        if ((0, util_1.isEmpty)(proposalId) || (0, util_1.isEmpty)(clientId)) {
            throw new HttpException_1.HttpException(400, 4004, 'proposal_id, client_id and proposal_type are required.');
        }
        // find service proposal
        const serviceProposal = await this.serviceProposal.findOne({ _id: new mongoose_1.default.Types.ObjectId(proposalId) });
        if (!serviceProposal)
            throw new HttpException_1.HttpException(400, 2002, 'SERVICE_PROPOSAL_NOT_FOUND');
        // find service
        const service = await this.service.findOne({ _id: new mongoose_1.default.Types.ObjectId(serviceProposal.service_id) });
        if (!service)
            throw new HttpException_1.HttpException(400, 2002, 'SERVICE_NOT_FOUND');
        console.log(serviceProposal);
        if (serviceProposal.client_id != clientId || serviceProposal.client_id === userId)
            throw new HttpException_1.HttpException(400, 2002, 'UNAUTHORIZE_USER');
        const client = await this.userService.findUserById(clientId);
        if (!client)
            throw new HttpException_1.HttpException(400, 2002, 'CLIENT_NOT_FOUND');
        await this.emailService.sendServiceReviewEmail(client.email, { serviceName: service.title }, client.first_name);
    }
    /*
    |--------------------------------------------------------------------------
    | Approve Service
    |--------------------------------------------------------------------------
    */
    async approveService(id, userId, body) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'ID cannot be empty');
        const { error } = service_validation_1.updateServiceProposalStatusValidation.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'SERVICE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.serviceProposal.findOne({ _id: id });
        if (!data)
            throw new HttpException_1.HttpException(400, 7002, 'SERVICE_PROPOSAL_NOT_FOUND');
        if (data.client_id != userId)
            throw new HttpException_1.HttpException(400, 2002, 'UNAUTHORIZE_USER');
        const updatedData = await this.serviceProposal.findByIdAndUpdate(id, body, {
            new: true,
        });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 2009, 'SERVICE_REQUEST_ERROR');
        return updatedData;
    }
}
exports.default = ServiceService;
//# sourceMappingURL=service.service.js.map