"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_status_1 = tslib_1.__importDefault(require("http-status"));
const auth_service_1 = tslib_1.__importDefault(require("@services/auth.service"));
const asyncWrapper_1 = require("@/utils/asyncWrapper");
const token_service_1 = tslib_1.__importDefault(require("@/modules/token/token.service"));
const email_service_1 = tslib_1.__importDefault(require("@/modules/email/email.service"));
const users_service_1 = tslib_1.__importDefault(require("@/services/users.service"));
const HttpException_1 = require("@/exceptions/HttpException");
const passport_middleware_1 = tslib_1.__importDefault(require("@/middlewares/passport.middleware"));
const google_auth_library_1 = require("google-auth-library");
class AuthController {
    constructor() {
        this.authService = new auth_service_1.default();
        this.tokenService = new token_service_1.default();
        this.userService = new users_service_1.default();
        this.emailService = new email_service_1.default();
        this.register = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
            const userData = req.body;
            const signUpUserData = await this.authService.signup(userData);
            const verifyEmailToken = await this.tokenService.generateVerifyEmailToken(signUpUserData._id);
            await this.emailService.sendVerificationEmail(signUpUserData.email, verifyEmailToken, signUpUserData.first_name);
            res.send({ status: 200, response_code: 1000, message: 'AUTH_REQUEST_SUCCESSFUL', data: signUpUserData });
        });
        this.logIn = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
            const userLogindata = req.body;
            const user = await this.authService.loginUserWithEmailAndPassword(userLogindata.email, userLogindata.password);
            const tokens = await this.tokenService.generateAuthTokens(user);
            res.send({ status: 200, response_code: 1000, message: 'AUTH_REQUEST_SUCCESSFUL', data: tokens });
        });
        this.googleLogin = passport_middleware_1.default.authenticate('google', { scope: ['profile', 'email'] });
        this.googleCallback = passport_middleware_1.default.authenticate('google', {
            failureRedirect: '/login',
            session: false, // Disable session management for this route
        });
        // Handle the redirect after successful Google login
        this.googleLoginRedirect = (req, res) => {
            var _a;
            const accessToken = (_a = req.user) === null || _a === void 0 ? void 0 : _a.token;
            res.redirect(`http://localhost:3000/signin?token=${accessToken}`);
        };
        this.googleLoginV2 = async (req, res) => {
            const { code } = req;
            // const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const client = new google_auth_library_1.OAuth2Client('49640201474-atgdtc4t37bj0ig5u5slu3bgk8kvf29j.apps.googleusercontent.com');
            const ticket = await client.verifyIdToken({
                idToken: code,
                audience: '49640201474-atgdtc4t37bj0ig5u5slu3bgk8kvf29j.apps.googleusercontent.com', // Your client ID
            });
            const payload = ticket.getPayload();
            const userId = payload.sub;
            const email = payload.email;
            console.log(payload);
            const data = {
                userId,
                email,
            };
            return res.status(200).send({ status: 200, response_code: 1000, message: 'AUTH_REQUEST_SUCCESSFUL', data });
        };
        this.logOut = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
            await this.authService.logout(req.body.refreshToken);
            res.status(http_status_1.default.NO_CONTENT).send();
        });
        this.forgotPassword = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
            const resetPasswordToken = await this.tokenService.generateResetPasswordToken(req.body.email);
            await this.emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
            res.status(200).send({ status: 200, response_code: 1000, message: 'AUTH_REQUEST_SUCCESSFUL', data: [] });
        });
        this.resetPassword = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
            const passwordData = req.body;
            if (passwordData.confirm_password !== passwordData.password) {
                throw new HttpException_1.HttpException(400, 1020, 'password mismatch');
            }
            await this.authService.resetPassword(req.query['token'], passwordData.password);
            res.status(200).send({ status: 200, response_code: 1000, message: 'AUTH_REQUEST_SUCCESSFUL', data: [] });
        });
        this.sendVerificationEmail = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
            const user = await this.userService.findUserByEmail(req.body.email);
            const verifyEmailToken = await this.tokenService.generateVerifyEmailToken(user === null || user === void 0 ? void 0 : user.id);
            await this.emailService.sendVerificationEmail(user === null || user === void 0 ? void 0 : user.email, verifyEmailToken, user === null || user === void 0 ? void 0 : user.first_name);
            res.status(200).send({ status: 200, response_code: 1000, message: 'AUTH_REQUEST_SUCCESSFUL', data: [] });
        });
        this.verifyEmail = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
            await this.authService.verifyEmail(req.query.token);
            res.status(200).send({ status: 200, response_code: 1000, message: 'AUTH_REQUEST_SUCCESSFUL', data: [] });
        });
        this.refreshTokens = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
            const userWithTokens = await this.authService.refreshAuth(req.body.refreshToken);
            res.send(Object.assign({}, userWithTokens));
        });
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map