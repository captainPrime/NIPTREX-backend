"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const config_1 = require("../config");
const flutterwave_1 = require("../modules/flutterwave");
const users_service_1 = tslib_1.__importDefault(require("../services/users.service"));
const wallet_service_1 = tslib_1.__importDefault(require("../services/wallet.service"));
const matchPercentage_1 = require("../utils/matchPercentage");
const service_service_1 = tslib_1.__importDefault(require("../services/service.service"));
const email_service_1 = tslib_1.__importDefault(require("../modules/email/email.service"));
const HttpException_1 = require("../exceptions/HttpException");
const service_models_1 = require("../models/service.models");
class ServiceController {
    constructor() {
        this.userService = new users_service_1.default();
        this.emailService = new email_service_1.default();
        this.walletService = new wallet_service_1.default();
        this.serviceService = new service_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Create Service
        |--------------------------------------------------------------------------
        */
        this.createService = async (req, res, next) => {
            try {
                const serviceData = req.body;
                const user_id = req.user.id;
                const data = await this.serviceService.createService(Object.assign(Object.assign({}, serviceData), { user_id }));
                res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Service by ID
        |--------------------------------------------------------------------------
        */
        this.getServiceById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.serviceService.getServiceById(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Service by user ID
        |--------------------------------------------------------------------------
        */
        this.getServiceByUserId = async (req, res, next) => {
            try {
                const id = req.params.id;
                const options = {
                    sortBy: req.query.sortBy || 'created_at:desc',
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    projectBy: req.query.projectBy || 'name:hide, role:hide',
                    search: req.query.search || '',
                };
                const filter = { user_id: id };
                const data = await this.serviceService.getServiceByUserId(options, filter);
                res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Service
        |--------------------------------------------------------------------------
        */
        this.getUserService = async (req, res, next) => {
            try {
                const id = req.user.id;
                const options = {
                    sortBy: req.query.sortBy || 'created_at:desc',
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    projectBy: req.query.projectBy || 'name:hide, role:hide',
                    search: req.query.search || '',
                };
                const filter = { user_id: id };
                const data = await this.serviceService.getServiceByUserId(options, filter);
                res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Service
        |--------------------------------------------------------------------------
        */
        this.getFeaturedService = async (req, res, next) => {
            try {
                const options = {
                    sortBy: req.query.sortBy || 'created_at:desc',
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    projectBy: req.query.projectBy || 'name:hide, role:hide',
                    search: req.query.search || '',
                };
                const filter = { featured: true };
                const data = await this.serviceService.getServiceByUserId(options, filter);
                res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Services
        |--------------------------------------------------------------------------
        */
        this.getAllServices = async (req, res, next) => {
            var _a;
            try {
                const options = {
                    sortBy: (_a = req.query) === null || _a === void 0 ? void 0 : _a.sortBy,
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    projectBy: req.query.projectBy || 'name:hide, role:hide',
                    search: req.query.search || '',
                    populate: 'user_id.first_name.last_name.profile_picture',
                };
                const data = await this.serviceService.getAllService(req.query, options);
                res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update Service by ID
        |--------------------------------------------------------------------------
        */
        this.updateServiceById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const body = req.body;
                const data = await this.serviceService.updateServiceById(id, body);
                res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Delete Service by ID
        |--------------------------------------------------------------------------
        */
        this.deleteService = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.serviceService.deleteService(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
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
        this.hireFreelancerService = async (req, res, next) => {
            try {
                const user_id = req.params.id;
                const service = await this.serviceService.getServiceById(req.body.service);
                if (!service)
                    throw new HttpException_1.HttpException(400, 7002, 'SERVICE_NOT_FOUND');
                const payload = {
                    user_id,
                    service: service._id.toString(),
                    proposal: req.body.proposal,
                    client: req.user.id,
                };
                console.log('Payload being sent:', payload); // 👈 Add this for debugging
                const data = await this.serviceService.hireFreelancerService(payload);
                res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | getAppliedServices
        |--------------------------------------------------------------------------
        */
        this.getAppliedServices = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const options = {
                    sortBy: 'created_at:desc',
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    projectBy: req.query.projectBy || 'name:hide, role:hide',
                    populate: 'service,user_id,proposal',
                };
                const data = await this.serviceService.getAppliedServices(userId, options);
                res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
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
        this.serviceProposal = async (req, res, next) => {
            try {
                const service_id = req.params.id;
                const { amount, package_type, delivery_date } = req.body;
                const serviceData = await this.serviceService.getServiceById(service_id);
                if (!serviceData)
                    throw new HttpException_1.HttpException(400, 7006, 'SERVICE_NOT_FOUND');
                const serviceProposals = await this.serviceService.getAllServiceProposalByServiceId(service_id);
                // console.log(serviceProposals);
                // const hasOngoingService = serviceProposals.some(
                //   (proposal: any) => proposal.status !== ServiceProposalStatus.COMPLETED && proposal.client_id.id.toString() === req.user.id,
                // );
                // if (hasOngoingService) {
                //   throw new HttpException(400, 7007, 'HAS_ONGOING_SERVICE');
                // }
                const payload = {
                    client_id: req.user.id,
                    service_id,
                    amount,
                    delivery_date,
                    package_type,
                };
                const data = await this.serviceService.createServiceProposal(payload);
                res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get all Service Proposal by service id
        |--------------------------------------------------------------------------
        */
        this.getAllServiceProposal = async (req, res, next) => {
            try {
                const service_id = req.params.id;
                const data = await this.serviceService.getAllServiceProposal(service_id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | getServiceProposalById
        |--------------------------------------------------------------------------
        */
        this.getServiceProposalById = async (req, res, next) => {
            try {
                const serviceProposalId = req.params.id;
                const proposalDoc = await this.serviceService.getServiceProposalById(serviceProposalId);
                if (!proposalDoc) {
                    return res.status(404).json({
                        status: 404,
                        response_code: 3001,
                        message: 'SERVICE_PROPOSAL_NOT_FOUND',
                    });
                }
                const serviceDoc = await this.serviceService.getServiceById(proposalDoc.service_id.toString());
                if (!serviceDoc) {
                    return res.status(404).json({
                        status: 404,
                        response_code: 3002,
                        message: 'RELATED_SERVICE_NOT_FOUND',
                    });
                }
                // Convert both Mongoose documents to plain JS objects
                const proposal = proposalDoc.toObject();
                const service = serviceDoc.toObject();
                res.status(200).json({
                    status: 200,
                    response_code: 3000,
                    message: 'SERVICE_REQUEST_SUCCESSFUL',
                    data: Object.assign(Object.assign({}, proposal), { service }),
                });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update Service Proposal by ID
        |--------------------------------------------------------------------------
        */
        this.updateServiceProposalById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const body = req.body;
                const data = await this.serviceService.updateServiceProjectById(id, body);
                res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Charge Card
        |--------------------------------------------------------------------------
        */
        this.makePayment = async (req, res, next) => {
            try {
                const { amount, currency, proposal_id } = req.body;
                const serviceProposal = await this.serviceService.getServiceProposalById(proposal_id);
                if (!serviceProposal)
                    throw new HttpException_1.HttpException(400, 7002, 'SERVICE_PROPOSAL_NOT_FOUND');
                // if (amount < serviceProposal.amount) throw new HttpException(400, 2002, 'AMOUNT_LESS_THAN_PROPOSAL_AMOUNT');
                const paymentData = {
                    tx_ref: (0, matchPercentage_1.generateUUID)(),
                    amount,
                    currency,
                    redirect_url: `http://localhost:3001/services/${serviceProposal.service_id}`,
                    meta: {
                        consumer_id: req.user.id,
                        consumer_mac: proposal_id,
                    },
                    customer: {
                        email: req.user.email,
                        phonenumber: req.user.phone_number,
                        name: `${req.user.first_name} ${req.user.last_name}`,
                    },
                };
                const response = await axios_1.default.post('https://api.flutterwave.com/v3/payments', paymentData, {
                    headers: {
                        Authorization: `Bearer ${config_1.FLW_SECRET_KEY}`,
                    },
                });
                res.status(200).json({ status: 200, response_code: 6000, message: 'SERVICE_REQUEST_SUCCESSFUL', data: response.data.data });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Charge Card
        |--------------------------------------------------------------------------
        */
        this.paymentCallback = async (req, res, next) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            try {
                const { status, transaction_id } = req.body;
                if (status === 'successful' || status === 'completed') {
                    // const transactionDetails = await flw.Transaction.find({ ref: tx_ref });
                    const response = await flutterwave_1.flw.Transaction.verify({ id: transaction_id });
                    // console.log('TRANSACTION_DETAILS', transactionDetails);
                    console.log('TRANSACTION_VERIFY', response);
                    if (response.data.status === 'successful') {
                        // Success! Confirm the customer's payment
                        const user = await this.userService.findUserById(response.data.meta.consumer_id);
                        const proposal = await this.serviceService.getServiceProposalById(response.data.meta.consumer_mac.toString());
                        if (!proposal)
                            throw new HttpException_1.HttpException(400, 7002, 'PROPOSAL_NOT_FOUND');
                        if (proposal && proposal.status == service_models_1.ServiceProposalStatus.PAID)
                            throw new HttpException_1.HttpException(400, 7002, 'PAYMENT_ALREADY_VERIFIED');
                        console.log('PROPOSAL', proposal);
                        const service = await this.serviceService.getServiceById(proposal.service_id.toString());
                        if (!service)
                            throw new HttpException_1.HttpException(400, 7002, 'SERVICE_NOT_FOUND');
                        const transactionData = {
                            user_id: user.id,
                            proposal_id: (_a = response.data.meta) === null || _a === void 0 ? void 0 : _a.consumer_mac,
                            tx_ref: response.data.tx_ref,
                            flw_ref: response.data.flw_ref,
                            amount: response.data.amount,
                            currency: response.data.currency,
                            status: response.data.status,
                            payment_type: response.data.payment_type,
                            created_at: new Date(response.data.created_at),
                            customer_id: (_c = (_b = response.data.customer) === null || _b === void 0 ? void 0 : _b.id.toString()) !== null && _c !== void 0 ? _c : (_d = response.meta) === null || _d === void 0 ? void 0 : _d.consumer_id.toString(),
                            customer_name: (_e = response.data.customer) === null || _e === void 0 ? void 0 : _e.name,
                            customer_email: (_f = response.data.customer) === null || _f === void 0 ? void 0 : _f.email,
                            nuban: (_g = response.data.meta) === null || _g === void 0 ? void 0 : _g.originatoraccountnumber,
                            bank: (_h = response.data.meta) === null || _h === void 0 ? void 0 : _h.bankname,
                            bank_name: (_j = response.data.meta) === null || _j === void 0 ? void 0 : _j.originatorname,
                            card_first_6digits: (_k = response.data.card) === null || _k === void 0 ? void 0 : _k.first_6digits,
                            card_last_4digits: (_l = response.data.card) === null || _l === void 0 ? void 0 : _l.last_4digits,
                            card_issuer: (_m = response.data.card) === null || _m === void 0 ? void 0 : _m.issuer,
                            card_country: (_o = response.data.card) === null || _o === void 0 ? void 0 : _o.country,
                            card_type: (_p = response.data.card) === null || _p === void 0 ? void 0 : _p.type,
                            card_expiry: (_q = response.data.card) === null || _q === void 0 ? void 0 : _q.expiry,
                        };
                        const transaction = await this.walletService.createTransaction(transactionData);
                        const emailPayload = {
                            proposalId: proposal.id,
                            jobTitle: service.title,
                        };
                        this.emailService.sendPaymentConfirmationEmail(user.email, emailPayload, user.first_name);
                        const payload = {
                            user_id: service.user_id,
                            service: service._id.toString(),
                            client: proposal.client_id._id.toString(),
                            proposal: proposal._id.toString(),
                        };
                        console.log(payload);
                        await this.serviceService.hireFreelancerService(payload);
                        await this.serviceService.updateServiceProjectById(proposal.id.toString(), { status: service_models_1.ServiceProposalStatus.PAID });
                        res.status(200).json({ status: 200, response_code: 6000, message: 'SERVICE_REQUEST_SUCCESSFUL', data: transaction });
                    }
                    else {
                        res.status(200).json({ status: 400, response_code: 6000, message: 'SERVICE_REQUEST_ERROR', data: [] });
                    }
                }
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Request Service Review
        |--------------------------------------------------------------------------
        */
        this.requestServiceReview = async (req, res, next) => {
            try {
                const { proposal_id, client_id } = req.body;
                await this.serviceService.requestServiceReview(proposal_id, client_id, req.user.id);
                res.status(200).json({ status: 200, response_code: 6000, message: 'SERVICE_REQUEST_SUCCESSFUL', data: [] });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Approve Service
        |--------------------------------------------------------------------------
        */
        this.approveService = async (req, res, next) => {
            try {
                const id = req.params.id;
                const body = req.body;
                const data = await this.serviceService.approveService(id, req.user.id, body);
                res.status(200).json({ status: 200, response_code: 3000, message: 'SERVICE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = ServiceController;
//# sourceMappingURL=service.controller.js.map