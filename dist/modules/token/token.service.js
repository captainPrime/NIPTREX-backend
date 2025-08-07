"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const http_status_1 = tslib_1.__importDefault(require("http-status"));
const token_model_1 = tslib_1.__importDefault(require("./token.model"));
const token_types_1 = tslib_1.__importDefault(require("./token.types"));
const ApiError_1 = tslib_1.__importDefault(require("@/exceptions/ApiError"));
const users_service_1 = tslib_1.__importDefault(require("@/services/users.service"));
const config_1 = require("@/config");
class TokenService {
    constructor() {
        this.userService = new users_service_1.default();
    }
    generateToken(userId, expires, type) {
        const payload = {
            sub: userId,
            iat: (0, moment_1.default)().unix(),
            exp: expires.unix(),
            type,
        };
        return jsonwebtoken_1.default.sign(payload, config_1.SECRET_KEY);
    }
    async saveToken(token, userId, expires, type, blacklisted = false) {
        const tokenDoc = await token_model_1.default.create({
            token,
            user: userId,
            expires: expires.toDate(),
            type,
            blacklisted,
        });
        return tokenDoc;
    }
    async verifyToken(token, type) {
        const payload = jsonwebtoken_1.default.verify(token, config_1.SECRET_KEY);
        if (typeof payload.sub !== 'string') {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'bad user');
        }
        const tokenDoc = await token_model_1.default.findOne({
            token,
            type,
            user: payload.sub,
            blacklisted: false,
        });
        if (!tokenDoc) {
            throw new Error('Token not found');
        }
        return tokenDoc;
    }
    async generateAuthTokens(user) {
        const accessTokenExpires = (0, moment_1.default)().add(config_1.JWT_ACCESS_EXPIRATION_MINUTES, 'days');
        const accessToken = this.generateToken(user.id, accessTokenExpires, token_types_1.default.ACCESS);
        const refreshTokenExpires = (0, moment_1.default)().add(config_1.JWT_REFRESH_EXPIRATION_DAYS, 'days');
        const refreshToken = this.generateToken(user.id, refreshTokenExpires, token_types_1.default.REFRESH);
        await this.saveToken(refreshToken, user.id, refreshTokenExpires, token_types_1.default.REFRESH);
        return {
            access: {
                token: accessToken,
                expires: accessTokenExpires.toDate(),
            },
            refresh: {
                token: refreshToken,
                expires: refreshTokenExpires.toDate(),
            },
        };
    }
    async generateResetPasswordToken(email) {
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NO_CONTENT, '');
        }
        const expires = (0, moment_1.default)().add(config_1.JWT_RESET_PASSWORD_EXPIRATION_MINUTES, 'minutes');
        const resetPasswordToken = this.generateToken(user._id, expires, token_types_1.default.RESET_PASSWORD);
        await this.saveToken(resetPasswordToken, user._id, expires, token_types_1.default.RESET_PASSWORD);
        return resetPasswordToken;
    }
    async generateVerifyEmailToken(userId) {
        const expires = (0, moment_1.default)().add(config_1.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES, 'minutes');
        const verifyEmailToken = this.generateToken(userId, expires, token_types_1.default.VERIFY_EMAIL);
        await this.saveToken(verifyEmailToken, userId, expires, token_types_1.default.VERIFY_EMAIL);
        return verifyEmailToken;
    }
}
exports.default = TokenService;
//# sourceMappingURL=token.service.js.map