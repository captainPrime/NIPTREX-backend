"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_status_1 = tslib_1.__importDefault(require("http-status"));
const jsonwebtoken_1 = require("jsonwebtoken");
const _config_1 = require("../config");
const users_model_1 = tslib_1.__importDefault(require("../models/users.model"));
const util_1 = require("../utils/util");
const ApiError_1 = tslib_1.__importDefault(require("../exceptions/ApiError"));
const users_service_1 = tslib_1.__importDefault(require("./users.service"));
const token_service_1 = tslib_1.__importDefault(require("../modules/token/token.service"));
const token_1 = require("../modules/token");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const HttpException_1 = require("../exceptions/HttpException");
class AuthService {
    constructor() {
        this.users = users_model_1.default;
        this.userService = new users_service_1.default();
        this.tokenService = new token_service_1.default();
        this.signup = async (userData) => {
            if ((0, util_1.isEmpty)(userData))
                throw new HttpException_1.HttpException(400, 1001, 'required fields cannot be empty');
            const findUser = await this.users.findOne({ email: userData.email });
            if (findUser)
                throw new HttpException_1.HttpException(400, 1002, `email ${userData.email} already exists`);
            const createUserData = await this.users.create(userData);
            return createUserData;
        };
        this.loginUserWithEmailAndPassword = async (email, password) => {
            const user = await this.userService.findUserByEmail(email);
            if (!user || !(await user.isPasswordMatch(password))) {
                throw new HttpException_1.HttpException(400, 1003, 'Incorrect email or password');
            }
            return user;
        };
        this.resetPassword = async (resetPasswordToken, newPassword) => {
            const resetPasswordTokenDoc = await this.tokenService.verifyToken(resetPasswordToken, token_1.tokenTypes.RESET_PASSWORD);
            const user = await this.userService.findUserById(resetPasswordTokenDoc.user);
            if (!user) {
                throw new HttpException_1.HttpException(400, 1005, 'Invalid reset password token');
            }
            const updatedUser = await this.userService.updateUser(user._id, { password: newPassword });
            await token_1.Token.deleteMany({ user: user._id, type: token_1.tokenTypes.RESET_PASSWORD });
            return updatedUser;
        };
        this.verifyEmail = async (verifyEmailToken) => {
            const verifyEmailTokenDoc = await this.tokenService.verifyToken(verifyEmailToken, token_1.tokenTypes.VERIFY_EMAIL);
            const user = await this.userService.findUserById(verifyEmailTokenDoc.user);
            if (!user) {
                throw new HttpException_1.HttpException(400, 1006, 'Invalid verification token');
            }
            await token_1.Token.deleteMany({ user: user._id, type: token_1.tokenTypes.VERIFY_EMAIL });
            const updatedUser = await this.userService.updateUser(user._id, { verified: true });
            return updatedUser;
        };
        this.refreshAuth = async (refreshToken) => {
            try {
                const refreshTokenDoc = await this.tokenService.verifyToken(refreshToken, token_1.tokenTypes.REFRESH);
                const user = await this.userService.findUserById(new mongoose_1.default.Types.ObjectId(refreshTokenDoc.user));
                if (!user) {
                    throw new HttpException_1.HttpException(400, 1005, 'cannot find user');
                }
                await refreshTokenDoc.remove();
                const tokens = await this.tokenService.generateAuthTokens(user);
                return { user, tokens };
            }
            catch (error) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate');
            }
        };
    }
    async logout(refreshToken) {
        const refreshTokenDoc = await token_1.Token.findOne({ token: refreshToken, type: token_1.tokenTypes.REFRESH, blacklisted: false });
        if (!refreshTokenDoc) {
            throw new HttpException_1.HttpException(400, 1004, 'Not found');
        }
        await refreshTokenDoc.remove();
    }
    createToken(user) {
        const dataStoredInToken = { _id: user._id };
        const secretKey = _config_1.SECRET_KEY;
        const expiresIn = 60 * 60;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return { expiresIn, token: (0, jsonwebtoken_1.sign)(dataStoredInToken, secretKey, { expiresIn }) };
    }
    createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map