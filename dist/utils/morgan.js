"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const logger_1 = require("./logger");
const config_1 = require("../config");
morgan_1.default.token('message', (_req, res) => res.locals['errorMessage'] || '');
const getIpFormat = () => (config_1.NODE_ENV === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;
const successHandler = (0, morgan_1.default)(successResponseFormat, {
    skip: (_req, res) => res.statusCode >= 400,
    stream: { write: (message) => logger_1.logger.info(message.trim()) },
});
const errorHandler = (0, morgan_1.default)(errorResponseFormat, {
    skip: (_req, res) => res.statusCode < 400,
    stream: { write: (message) => logger_1.logger.error(message.trim()) },
});
exports.default = {
    successHandler,
    errorHandler,
};
//# sourceMappingURL=morgan.js.map