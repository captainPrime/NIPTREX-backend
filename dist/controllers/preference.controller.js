"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const users_service_1 = tslib_1.__importDefault(require("@/services/users.service"));
const HttpException_1 = require("@/exceptions/HttpException");
const preference_service_1 = tslib_1.__importDefault(require("@/services/preference.service"));
class PreferenceController {
    constructor() {
        this.userService = new users_service_1.default();
        this.preferenceService = new preference_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Create Preference
        |--------------------------------------------------------------------------
        */
        this.createPreference = async (req, res, next) => {
            try {
                const userData = req.body;
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const preference = await this.preferenceService.getUserPreference(req.user.id);
                if (preference.length !== 0)
                    throw new HttpException_1.HttpException(400, 5002, 'WORK_PREFERENCE_ALREAD_ADDED');
                const data = await this.preferenceService.createPreference(Object.assign(Object.assign({}, userData), { user_id: req.user.id }));
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Preference
        |--------------------------------------------------------------------------
        */
        this.getUserPreference = async (req, res, next) => {
            try {
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const data = await this.preferenceService.getUserPreference(req.user.id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Preference By Id
        |--------------------------------------------------------------------------
        */
        this.getPreferenceById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.preferenceService.getPreferenceById(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update Preference
        |--------------------------------------------------------------------------
        */
        this.updatePreference = async (req, res, next) => {
            try {
                const body = req.body;
                const data = await this.preferenceService.updatePreferenceById(req.user.id, body);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Delete Preference
        |--------------------------------------------------------------------------
        */
        this.deletePreference = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.preferenceService.deletePreference(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = PreferenceController;
//# sourceMappingURL=preference.controller.js.map