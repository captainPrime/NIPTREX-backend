"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const service_controller_1 = tslib_1.__importDefault(require("@/controllers/service.controller"));
const auth_middleware_1 = tslib_1.__importDefault(require("@/middlewares/auth.middleware"));
class ServiceRoute {
    constructor() {
        this.path = '/service';
        this.router = (0, express_1.Router)();
        this.serviceController = new service_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}`, (0, auth_middleware_1.default)(['freelancer']), this.serviceController.createService);
        this.router.get(`${this.path}`, this.serviceController.getAllServices);
        this.router.get(`${this.path}/getAppliedServices`, (0, auth_middleware_1.default)(['client', 'freelancer']), this.serviceController.getAppliedServices);
        this.router.get(`${this.path}/getFeaturedService`, (0, auth_middleware_1.default)(['client', 'freelancer']), this.serviceController.getFeaturedService);
        this.router.get(`${this.path}/getServiceById/:id`, this.serviceController.getServiceById);
        this.router.get(`${this.path}/getServiceByUserId/:id`, this.serviceController.getServiceByUserId);
        this.router.get(`${this.path}/getUserService`, (0, auth_middleware_1.default)(['freelancer']), this.serviceController.getUserService);
        this.router.put(`${this.path}/updateServiceById/:id`, (0, auth_middleware_1.default)(['freelancer']), this.serviceController.updateServiceById);
        this.router.delete(`${this.path}/deleteService/:id`, (0, auth_middleware_1.default)(['freelancer']), this.serviceController.deleteService);
        this.router.post(`${this.path}/hireFreelancerService/:id`, (0, auth_middleware_1.default)(['client', 'freelancer']), this.serviceController.hireFreelancerService);
        this.router.post(`${this.path}/proposal/:id`, (0, auth_middleware_1.default)(['client', 'freelancer']), this.serviceController.serviceProposal);
        this.router.get(`${this.path}/proposals/:id`, (0, auth_middleware_1.default)(['client', 'freelancer']), this.serviceController.getAllServiceProposal);
        this.router.get(`${this.path}/getServiceProposalById/:id`, (0, auth_middleware_1.default)(['client', 'freelancer']), this.serviceController.getServiceProposalById);
        this.router.put(`${this.path}/proposal/:id`, (0, auth_middleware_1.default)(['client', 'freelancer']), this.serviceController.updateServiceProposalById);
        this.router.put(`${this.path}/approveService/:id`, (0, auth_middleware_1.default)(['client', 'freelancer']), this.serviceController.approveService);
        this.router.post(`${this.path}/payment`, (0, auth_middleware_1.default)(['client', 'freelancer']), this.serviceController.makePayment);
        this.router.post(`${this.path}/paymentCallback`, (0, auth_middleware_1.default)(['client', 'freelancer']), this.serviceController.paymentCallback);
        this.router.post(`${this.path}/requestServiceReview`, (0, auth_middleware_1.default)(['client', 'freelancer']), this.serviceController.requestServiceReview);
    }
}
exports.default = ServiceRoute;
//# sourceMappingURL=service.route.js.map