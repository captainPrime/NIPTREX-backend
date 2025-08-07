"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserRequest = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const class_validator_1 = require("class-validator");
const HttpException_1 = require("../exceptions/HttpException");
// Use as first argument of the validation middleware - classInstance
class CreateUserRequest {
}
tslib_1.__decorate([
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", String)
], CreateUserRequest.prototype, "userName", void 0);
exports.CreateUserRequest = CreateUserRequest;
class RequestValidator {
}
_a = RequestValidator;
RequestValidator.validate = (classInstance, skipMissingProperties = false, whitelist = true, forbidNonWhitelisted = true) => {
    return async (req, res, next) => {
        const convertedObject = (0, class_transformer_1.plainToInstance)(classInstance, req.body);
        await (0, class_validator_1.validate)(convertedObject, { skipMissingProperties, whitelist, forbidNonWhitelisted }).then((errors) => {
            var _b;
            if (errors.length > 0) {
                let rawErrors = [];
                for (const errorItem of errors) {
                    rawErrors = rawErrors.concat(...rawErrors, Object.values((_b = errorItem.constraints) !== null && _b !== void 0 ? _b : []));
                }
                const message = errors.map((error) => { var _b; return Object.values((_b = error.constraints) !== null && _b !== void 0 ? _b : {}); }).join(', ');
                next(new HttpException_1.BadRequestError(message, rawErrors));
            }
            else {
                next();
            }
        });
    };
};
exports.default = RequestValidator;
//# sourceMappingURL=validation.middleware.js.map