"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const users_service_1 = tslib_1.__importDefault(require("../services/users.service"));
const HttpException_1 = require("../exceptions/HttpException");
const about_service_1 = tslib_1.__importDefault(require("../services/about.service"));
const matchPercentage_1 = require("../utils/matchPercentage");
class UsersController {
    constructor() {
        this.userService = new users_service_1.default();
        this.aboutService = new about_service_1.default();
        this.getUsers = async (req, res, next) => {
            try {
                const findAllUsersData = await this.userService.findAllUser();
                res.status(200).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: findAllUsersData });
            }
            catch (error) {
                next(error);
            }
        };
        this.findAllFreelancer = async (req, res, next) => {
            try {
                const findAllUsersData = await this.userService.findAllFreelancer(req.query);
                res.status(200).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: findAllUsersData });
            }
            catch (error) {
                next(error);
            }
        };
        this.getUserById = async (req, res, next) => {
            try {
                const userId = req.params.id;
                const findOneUserData = await this.userService.findUserById(userId);
                res.status(200).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: findOneUserData });
            }
            catch (error) {
                next(error);
            }
        };
        this.createUser = async (req, res, next) => {
            try {
                const userData = req.body;
                const createUserData = await this.userService.createUser(Object.assign(Object.assign({}, userData), { referral_code: (0, matchPercentage_1.generateReferralCode)(8) }));
                if (userData.referral_code) {
                    const referredUser = await this.userService.findUserByReferralCode(userData.referral_code);
                    if (!referredUser)
                        throw new HttpException_1.HttpException(400, 2004, 'USER_NOT_FOUND');
                    await this.aboutService.updateAboutById(referredUser.id, { nips: +10 });
                }
                res.status(201).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: createUserData });
            }
            catch (error) {
                next(error);
            }
        };
        this.getProfile = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const findOneUserData = await this.userService.findUserById(userId);
                res.status(200).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: findOneUserData });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateUser = async (req, res, next) => {
            try {
                const userId = req.params.id;
                const userData = req.body;
                const updateUserData = await this.userService.updateUser(userId, userData);
                res.status(200).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: updateUserData });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteUser = async (req, res, next) => {
            try {
                const userId = req.params.id;
                const deleteUserData = await this.userService.deleteUser(userId);
                res.status(200).json({ status: 200, response_code: 2000, message: 'USER_REQUEST_SUCCESSFUL', data: deleteUserData });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = UsersController;
//# sourceMappingURL=users.controller.js.map