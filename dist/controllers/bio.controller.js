"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const users_service_1 = tslib_1.__importDefault(require("../services/users.service"));
const HttpException_1 = require("../exceptions/HttpException");
const bio_service_1 = tslib_1.__importDefault(require("../services/bio.service"));
class BioController {
    constructor() {
        this.userService = new users_service_1.default();
        this.bioService = new bio_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Create Bio
        |--------------------------------------------------------------------------
        */
        this.createBio = async (req, res, next) => {
            try {
                const userData = req.body;
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const bio = await this.bioService.getUserBio(req.user.id);
                if (bio.length !== 0)
                    throw new HttpException_1.HttpException(400, 5002, 'BIO_ALREAD_ADDED');
                const data = await this.bioService.createBio(Object.assign(Object.assign({}, userData), { user_id: req.user.id }));
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Bio
        |--------------------------------------------------------------------------
        */
        this.getUserBio = async (req, res, next) => {
            try {
                const data = await this.bioService.getUserBio(req.user.id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Bio By Id
        |--------------------------------------------------------------------------
        */
        this.getBioById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.bioService.getBioById(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update Bio
        |--------------------------------------------------------------------------
        */
        this.updateBio = async (req, res, next) => {
            try {
                const body = req.body;
                const data = await this.bioService.updateBioById(req.user.id, body);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Delete Bio
        |--------------------------------------------------------------------------
        */
        this.deleteBio = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.bioService.deleteBio(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = BioController;
//# sourceMappingURL=bio.controller.js.map