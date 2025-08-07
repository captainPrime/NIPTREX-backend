"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const users_service_1 = tslib_1.__importDefault(require("../services/users.service"));
const HttpException_1 = require("../exceptions/HttpException");
const about_service_1 = tslib_1.__importDefault(require("../services/about.service"));
class AboutController {
    constructor() {
        this.userService = new users_service_1.default();
        this.aboutService = new about_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Create About
        |--------------------------------------------------------------------------
        */
        this.createAbout = async (req, res, next) => {
            try {
                const userData = req.body;
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const about = await this.aboutService.getUserAbout(req.user.id);
                console.log('ABOUT', about);
                if (about)
                    throw new HttpException_1.HttpException(400, 5002, 'ABOUT_ALREADY_ADDED');
                const { first_name, last_name, email, country, id } = req.user;
                const payload = Object.assign(Object.assign({}, userData), { user_id: id, personal_details: Object.assign(Object.assign({}, userData.personal_details), { first_name,
                        last_name,
                        email,
                        country }) });
                const data = await this.aboutService.createAbout(payload);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User About
        |--------------------------------------------------------------------------
        */
        this.getUserAbout = async (req, res, next) => {
            try {
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const data = await this.aboutService.getUserAbout(req.user.id);
                if (!data)
                    throw new HttpException_1.HttpException(400, 2002, 'ABOUT_NOT_FOUND');
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get About By Id
        |--------------------------------------------------------------------------
        */
        this.getAboutById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.aboutService.getAboutById(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update About
        |--------------------------------------------------------------------------
        */
        this.updateAbout = async (req, res, next) => {
            try {
                const body = req.body;
                const data = await this.aboutService.updateAboutById(req.user.id, body);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update About
        |--------------------------------------------------------------------------
        */
        this.updateResumeById = async (req, res, next) => {
            try {
                const body = req.body;
                const { id } = req.params;
                const data = await this.aboutService.updateResumeById(req.user.id, body, id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update About
        |--------------------------------------------------------------------------
        */
        this.deleteResumeById = async (req, res, next) => {
            try {
                const { id } = req.params;
                const data = await this.aboutService.deleteResumeById(req.user.id, id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Delete About
        |--------------------------------------------------------------------------
        */
        this.deleteAbout = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.aboutService.deleteAbout(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = AboutController;
//# sourceMappingURL=about.controller.js.map