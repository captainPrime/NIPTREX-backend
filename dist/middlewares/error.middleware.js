"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../utils/logger");
class ErrorMiddleware {
}
_a = ErrorMiddleware;
ErrorMiddleware.handleError = () => {
    return async (error, req, res, next) => {
        try {
            const status = error.status || 400;
            const response_code = error.responseCode || 400;
            const message = error.message || 'Something went wrong';
            const data = error.data || [];
            logger_1.logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
            res.status(200).json({ status, response_code, message, data });
        }
        catch (error) {
            next(error);
        }
    };
};
ErrorMiddleware.initializeUnhandledException = () => {
    process.on('unhandledRejection', (reason) => {
        logger_1.logger.error(`[${reason.name}] >> ${reason.message}`);
        logger_1.logger.info('UNHANDLED REJECTION! 💥 Shutting down...');
        throw reason;
    });
    process.on('uncaughtException', (error) => {
        logger_1.logger.error(`[${error.name}] >> ${error.message}`);
        logger_1.logger.info('UNCAUGHT EXCEPTION! 💥 Shutting down...');
        process.exit(1);
    });
};
exports.default = ErrorMiddleware;
//# sourceMappingURL=error.middleware.js.map