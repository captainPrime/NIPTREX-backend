"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const users_controller_1 = tslib_1.__importDefault(require("@controllers/users.controller"));
const users_dto_1 = require("@dtos/users.dto");
const validation_middleware_1 = tslib_1.__importDefault(require("@/middlewares/validation.middleware"));
const auth_middleware_1 = tslib_1.__importDefault(require("@/middlewares/auth.middleware"));
class UsersRoute {
    constructor() {
        this.path = '/users';
        this.router = (0, express_1.Router)();
        this.usersController = new users_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.usersController.getUsers);
        this.router.get(`${this.path}/getAllFreelancer`, this.usersController.findAllFreelancer);
        this.router.get(`${this.path}/profile`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.usersController.getProfile);
        this.router.get(`${this.path}/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.usersController.getUserById);
        this.router.post(`${this.path}`, validation_middleware_1.default.validate(users_dto_1.CreateUserDto), this.usersController.createUser);
        this.router.put(`${this.path}/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.usersController.updateUser);
        this.router.delete(`${this.path}/:id`, this.usersController.deleteUser);
    }
}
exports.default = UsersRoute;
//# sourceMappingURL=users.route.js.map