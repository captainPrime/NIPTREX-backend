"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const users_service_1 = tslib_1.__importDefault(require("../services/users.service"));
const config_service_1 = tslib_1.__importDefault(require("../services/config.service"));
class ConfigController {
    constructor() {
        this.userService = new users_service_1.default();
        this.configService = new config_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Create Config
        |--------------------------------------------------------------------------
        */
        this.createConfig = async (req, res, next) => {
            try {
                const userData = req.body;
                //   const user: any = await this.userService.findUserById(req.user.id);
                //   if (!user.verified) {
                //     throw new HttpException(400, 1004, 'ACCOUNT_NOT_VERIFIED');
                //   }
                //   const config = await this.configService.getUserConfig(req.user.id);
                //   if (config.length !== 0) throw new HttpException(400, 5002, 'WORK_Config_ALREAD_ADDED');
                const data = await this.configService.createConfig(userData);
                res.status(200).json({ status: 200, response_code: 9000, message: 'CONFIG_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Config
        |--------------------------------------------------------------------------
        */
        this.getAllConfig = async (req, res, next) => {
            try {
                const data = await this.configService.getAllConfig();
                res.status(200).json({ status: 200, response_code: 9000, message: 'CONFIG_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Config By Id
        |--------------------------------------------------------------------------
        */
        this.getConfigById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.configService.getConfigById(id);
                res.status(200).json({ status: 200, response_code: 9000, message: 'CONFIG_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Update Config
        |--------------------------------------------------------------------------
        */
        this.updateConfig = async (req, res, next) => {
            try {
                const body = req.body;
                const data = await this.configService.updateConfigById(req.params.id, body);
                res.status(200).json({ status: 200, response_code: 9000, message: 'CONFIG_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Delete Config
        |--------------------------------------------------------------------------
        */
        this.deleteConfig = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.configService.deleteConfig(id);
                res.status(200).json({ status: 200, response_code: 9000, message: 'CONFIG_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = ConfigController;
//# sourceMappingURL=config.controller.js.map