"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const users_service_1 = tslib_1.__importDefault(require("@/services/users.service"));
const HttpException_1 = require("@/exceptions/HttpException");
const certification_service_1 = tslib_1.__importDefault(require("@/services/certification.service"));
class CertificationController {
    constructor() {
        this.userService = new users_service_1.default();
        this.certificationService = new certification_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Create Certification
        |--------------------------------------------------------------------------
        */
        this.createCertification = async (req, res, next) => {
            try {
                const userData = req.body;
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const data = await this.certificationService.createCertification(Object.assign(Object.assign({}, userData), { user_id: req.user.id }));
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Certification
        |--------------------------------------------------------------------------
        */
        this.getUserCertification = async (req, res, next) => {
            try {
                const user = await this.userService.findUserById(req.user.id);
                if (!user.verified) {
                    throw new HttpException_1.HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                }
                const data = await this.certificationService.getUserCertification(req.user.id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Certification By Id
        |--------------------------------------------------------------------------
        */
        this.getCertificationById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.certificationService.getCertificationById(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update Certification
        |--------------------------------------------------------------------------
        */
        this.updateCertification = async (req, res, next) => {
            try {
                const id = req.params.id;
                const body = req.body;
                const data = await this.certificationService.updateCertificationById(id, body);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Delete Certification
        |--------------------------------------------------------------------------
        */
        this.deleteCertification = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.certificationService.deleteCertification(id);
                res.status(200).json({ status: 200, response_code: 3000, message: 'PROFILE_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = CertificationController;
//# sourceMappingURL=certification.controller.js.map