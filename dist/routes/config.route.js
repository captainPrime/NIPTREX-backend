"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const config_controller_1 = tslib_1.__importDefault(require("@/controllers/config.controller"));
class ConfigRoute {
    constructor() {
        this.path = '/config';
        this.router = (0, express_1.Router)();
        this.configController = new config_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}`, this.configController.createConfig);
        this.router.get(`${this.path}`, this.configController.getAllConfig);
        this.router.get(`${this.path}/getConfigById/:id`, this.configController.getConfigById);
        this.router.delete(`${this.path}/:id`, this.configController.deleteConfig);
        this.router.put(`${this.path}/:id`, this.configController.updateConfig);
    }
}
exports.default = ConfigRoute;
//# sourceMappingURL=config.route.js.map