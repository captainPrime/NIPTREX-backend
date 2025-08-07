"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceUnavailableError = exports.ApplicationError = exports.BadRequestError = exports.NotFoundError = exports.HttpException = void 0;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const http_status_codes_1 = require("http-status-codes");
class HttpException extends Error {
    constructor(status, responseCode, message, data = []) {
        super(message);
        this.status = status;
        this.responseCode = responseCode;
        this.message = message;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HttpException = HttpException;
class NotFoundError extends HttpException {
    constructor(path) {
        super(http_status_codes_1.StatusCodes.NOT_FOUND, 1000, `The requested path ${path} not found!`);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends HttpException {
    constructor(message, errors) {
        super(http_status_codes_1.StatusCodes.BAD_REQUEST, 1023, message, errors);
    }
}
exports.BadRequestError = BadRequestError;
class ApplicationError extends HttpException {
    constructor(message, errors) {
        super(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 1032, message, errors);
    }
}
exports.ApplicationError = ApplicationError;
class ServiceUnavailableError extends HttpException {
    constructor(message, errors) {
        super(http_status_codes_1.StatusCodes.SERVICE_UNAVAILABLE, 1032, message, errors);
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
//# sourceMappingURL=HttpException.js.map