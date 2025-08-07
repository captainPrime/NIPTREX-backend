"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsonwebtoken_1 = require("jsonwebtoken");
const _config_1 = require("@config");
const HttpException_1 = require("@exceptions/HttpException");
const users_model_1 = tslib_1.__importDefault(require("@models/users.model"));
const authMiddleware = (roles) => async (req, res, next) => {
    try {
        const Authorization = req.headers.authorization ? req.headers.authorization.split('Bearer ')[1] : null;
        if (Authorization) {
            const verificationResponse = (0, jsonwebtoken_1.verify)(Authorization, _config_1.SECRET_KEY);
            const findUser = await users_model_1.default.findById(verificationResponse.sub);
            if (findUser) {
                // Check user role
                const userRole = findUser.user; // Assuming user role is stored in 'user' property
                if (!roles || roles.includes(userRole)) {
                    // If roles are not specified or user role is included in the specified roles, allow access
                    req.user = findUser;
                    next();
                }
                else {
                    // If user role does not match the specified roles, throw unauthorized error
                    next(new HttpException_1.HttpException(401, 1031, 'UNAUTHORIZED_USER'));
                }
            }
            else {
                next(new HttpException_1.HttpException(400, 1030, 'INVALID_AUTHORIZATION'));
            }
        }
        else {
            next(new HttpException_1.HttpException(400, 1030, 'AUTHENTICATION_TOKEN_MISSING'));
        }
    }
    catch (error) {
        next(new HttpException_1.HttpException(400, 1030, 'INVALID_AUTHORIZATION'));
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map