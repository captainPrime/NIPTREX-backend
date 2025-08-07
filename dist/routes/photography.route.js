"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const auth_middleware_1 = tslib_1.__importDefault(require("@/middlewares/auth.middleware"));
const photography_controller_1 = tslib_1.__importDefault(require("@/controllers/photography.controller"));
const multerConfig_1 = require("@/utils/multerConfig");
class PhotographyRoute {
    constructor() {
        this.path = '/photography';
        this.router = (0, express_1.Router)();
        this.photographyController = new photography_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}`, (0, auth_middleware_1.default)(['freelancer', 'client']), multerConfig_1.upload.single('image'), this.photographyController.createPhotography);
        this.router.get(`${this.path}`, this.photographyController.getAllPhotography);
        this.router.get(`${this.path}/getPhotographyById/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.photographyController.getPhotographyById);
        this.router.delete(`${this.path}/deletePhotographyById/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.photographyController.deletePhotography);
        // this.router.put(`${this.path}/updateInvoice/:id`, authMiddleware(['freelancer']), this.photographyController.updatePhotography);
        this.router.get(`${this.path}/getUserPhotography`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.photographyController.getUserPhotography);
        this.router.post(`${this.path}/payment`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.photographyController.makePayment);
        this.router.post(`${this.path}/paymentCallback`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.photographyController.paymentCallback);
    }
}
exports.default = PhotographyRoute;
//# sourceMappingURL=photography.route.js.map