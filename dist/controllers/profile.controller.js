"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const profile_service_1 = tslib_1.__importDefault(require("../services/profile.service"));
const users_service_1 = tslib_1.__importDefault(require("../services/users.service"));
const HttpException_1 = require("../exceptions/HttpException");
// import { CreateProfileDto } from '../dtos/profile.dto';
class ProfileController {
    constructor() {
        this.userService = new users_service_1.default();
        this.profileService = new profile_service_1.default();
        this.getProfile = async (req, res, next) => {
            var _a;
            try {
                const userId = (_a = req.query.id) !== null && _a !== void 0 ? _a : req.user.id;
                const findOneUserData = await this.profileService.getProfile(userId);
                res.status(200).json({ status: 200, response_code: 2000, message: 'PROFILE_REQUEST_SUCCESSFUL', data: findOneUserData });
            }
            catch (error) {
                next(error);
            }
        };
        this.getDirectProfile = async (req, res, next) => {
            var _a;
            try {
                const userId = (_a = req.query.id) !== null && _a !== void 0 ? _a : req.user.id;
                const findOneUserData = await this.profileService.getDirectProfile(userId);
                res.status(200).json({ status: 200, response_code: 2000, message: 'PROFILE_REQUEST_SUCCESSFUL', data: findOneUserData });
            }
            catch (error) {
                next(error);
            }
        };
        this.getProfileByUserId = async (req, res, next) => {
            try {
                const userId = req.query.id;
                const findOneUserData = await this.profileService.getProfile(userId);
                res.status(200).json({ status: 200, response_code: 2000, message: 'PROFILE_REQUEST_SUCCESSFUL', data: findOneUserData });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Create Experience
        |--------------------------------------------------------------------------
        */
        this.createExperience = async (req, res, next) => {
            try {
                const userData = req.body;
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const data = await this.profileService.createExperience(Object.assign(Object.assign({}, userData), { user_id: req.user.id }));
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Experience
        |--------------------------------------------------------------------------
        */
        this.getUserExperience = async (req, res, next) => {
            try {
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const data = await this.profileService.getUserExperience(req.user.id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Experience By Id
        |--------------------------------------------------------------------------
        */
        this.getExperienceById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.profileService.getExperienceById(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update Experience
        |--------------------------------------------------------------------------
        */
        this.updateExperience = async (req, res, next) => {
            try {
                const id = req.params.id;
                const body = req.body;
                const data = await this.profileService.updateExperienceById(id, body);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Delete Experience
        |--------------------------------------------------------------------------
        */
        this.deleteExperience = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.profileService.deleteExperience(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = ProfileController;
//# sourceMappingURL=profile.controller.js.map