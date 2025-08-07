"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const users_service_1 = tslib_1.__importDefault(require("@/services/users.service"));
const HttpException_1 = require("@/exceptions/HttpException");
const identity_service_1 = tslib_1.__importDefault(require("@/services/identity.service"));
class IdentityController {
    constructor() {
        this.userService = new users_service_1.default();
        this.identityService = new identity_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Create Identity
        |--------------------------------------------------------------------------
        */
        this.createIdentity = async (req, res, next) => {
            try {
                const userData = req.body;
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const identity = await this.identityService.getUserIdentity(req.user.id);
                if (identity.length !== 0)
                    throw new HttpException_1.HttpException(400, 5002, 'IDENTITY_ALREAD_ADDED');
                const data = await this.identityService.createIdentity(Object.assign(Object.assign({}, userData), { user_id: req.user.id }));
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Identity
        |--------------------------------------------------------------------------
        */
        this.getUserIdentity = async (req, res, next) => {
            try {
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const data = await this.identityService.getUserIdentity(req.user.id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Identity By Id
        |--------------------------------------------------------------------------
        */
        this.getIdentityById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.identityService.getIdentityById(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update Identity
        |--------------------------------------------------------------------------
        */
        this.updateIdentity = async (req, res, next) => {
            try {
                const body = req.body;
                const data = await this.identityService.updateIdentityById(req.user.id, body);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Delete Identity
        |--------------------------------------------------------------------------
        */
        this.deleteIdentity = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.identityService.deleteIdentity(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = IdentityController;
//# sourceMappingURL=identity.controller.js.map