"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const auth_controller_1 = tslib_1.__importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = tslib_1.__importDefault(require("../middlewares/auth.middleware"));
const validation_middleware_1 = tslib_1.__importDefault(require("../middlewares/validation.middleware"));
const users_dto_1 = require("../dtos/users.dto");
class AuthRoute {
    constructor() {
        this.path = '/auth';
        this.router = (0, express_1.Router)();
        this.authController = new auth_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/register`, validation_middleware_1.default.validate(users_dto_1.CreateUserDto), this.authController.register);
        this.router.post(`${this.path}/login`, validation_middleware_1.default.validate(users_dto_1.UserLoginDto), this.authController.logIn);
        this.router.get(`${this.path}/google`, this.authController.googleLogin);
        this.router.get(`${this.path}/v2/google`, this.authController.googleLoginV2);
        this.router.get(`${this.path}/oauth`, this.authController.googleCallback, this.authController.googleLoginRedirect);
        this.router.post(`${this.path}/logout`, auth_middleware_1.default, this.authController.logOut);
        this.router.post(`${this.path}/refresh_tokens`, auth_middleware_1.default, this.authController.refreshTokens);
        this.router.post(`${this.path}/forgot_password`, this.authController.forgotPassword);
        this.router.post(`${this.path}/reset_password`, validation_middleware_1.default.validate(users_dto_1.ResetPasswordDto), this.authController.resetPassword);
        this.router.post(`${this.path}/send_verification_email`, this.authController.sendVerificationEmail);
        this.router.post(`${this.path}/verify_email`, this.authController.verifyEmail);
    }
}
exports.default = AuthRoute;
//# sourceMappingURL=auth.route.js.map