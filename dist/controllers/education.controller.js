"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const users_service_1 = tslib_1.__importDefault(require("../services/users.service"));
const HttpException_1 = require("../exceptions/HttpException");
const education_service_1 = tslib_1.__importDefault(require("../services/education.service"));
class EducationController {
    constructor() {
        this.userService = new users_service_1.default();
        this.educationService = new education_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Create Education
        |--------------------------------------------------------------------------
        */
        this.createEducation = async (req, res, next) => {
            try {
                const userData = req.body;
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const data = await this.educationService.createEducation(Object.assign(Object.assign({}, userData), { user_id: req.user.id }));
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Education
        |--------------------------------------------------------------------------
        */
        this.getUserEducation = async (req, res, next) => {
            try {
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const data = await this.educationService.getUserEducation(req.user.id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Education By Id
        |--------------------------------------------------------------------------
        */
        this.getEducationById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.educationService.getEducationById(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update Education
        |--------------------------------------------------------------------------
        */
        this.updateEducation = async (req, res, next) => {
            try {
                const id = req.params.id;
                const body = req.body;
                const data = await this.educationService.updateEducationById(id, body);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Delete Education
        |--------------------------------------------------------------------------
        */
        this.deleteEducation = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.educationService.deleteEducation(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = EducationController;
//# sourceMappingURL=education.controller.js.map