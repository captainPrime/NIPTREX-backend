"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const auth_middleware_1 = tslib_1.__importDefault(require("../middlewares/auth.middleware"));
const rating_controller_1 = tslib_1.__importDefault(require("../controllers/rating.controller"));
class RatingRoute {
    constructor() {
        this.path = '/rate';
        this.router = (0, express_1.Router)();
        this.ratingController = new rating_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.ratingController.rateEntity);
        this.router.get(`${this.path}/getRatingById/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.ratingController.getRatingById);
        this.router.get(`${this.path}/getRatingByUserId/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.ratingController.getRatingByUserId);
        this.router.get(`${this.path}/getUserRating`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.ratingController.getUserRating);
        this.router.get(`${this.path}`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.ratingController.getAllRatings);
        this.router.put(`${this.path}/unRateEntity/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.ratingController.unRateEntity);
    }
}
exports.default = RatingRoute;
//# sourceMappingURL=rating.route.js.map