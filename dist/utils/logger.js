"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const fs_1 = require("fs");
const path_1 = require("path");
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = tslib_1.__importDefault(require("winston-daily-rotate-file"));
const _config_1 = require("../config");
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const { combine, timestamp, splat, colorize } = winston_1.format;
// logs dir
const logDir = (0, path_1.join)(__dirname, _config_1.LOG_DIR);
if (!(0, fs_1.existsSync)(logDir)) {
    (0, fs_1.mkdirSync)(logDir);
}
/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
class Logger {
}
Logger.getInstance = (service = 'general-purpose') => {
    const logger = (0, winston_1.createLogger)({
        defaultMeta: { service },
        format: combine(timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }), Logger.logFormat),
        transports: [
            // debug log setting
            Logger.getDebugLoggerTransport(),
            // error log setting
            Logger.getErrorLoggerTransport(),
        ],
        exceptionHandlers: [new winston_1.transports.File({ filename: 'exceptions.log' })],
        rejectionHandlers: [new winston_1.transports.File({ filename: 'rejections.log' })],
    });
    if (_config_1.NODE_ENV !== 'production') {
        logger.add(new winston_1.transports.Console({
            format: combine(splat(), colorize()),
        }));
    }
    return logger;
};
Logger.logFormat = winston_1.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);
Logger.info = (message) => {
    Logger.info(message);
};
Logger.error = (message) => {
    Logger.error(message);
};
Logger.getErrorLoggerTransport = () => {
    return new winston_daily_rotate_file_1.default({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir + '/error',
        filename: `info-%DATE%.log`,
        maxFiles: 30,
        handleExceptions: true,
        json: false,
        zippedArchive: true,
    });
};
Logger.getDebugLoggerTransport = () => {
    return new winston_daily_rotate_file_1.default({
        level: 'debug',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir + '/debug',
        filename: `info-%DATE%.log`,
        maxFiles: 30,
        json: false,
        zippedArchive: true,
    });
};
Logger.getHttpLoggerInstance = () => {
    const logger = Logger.getInstance();
    const stream = {
        write: (message) => {
            logger.info(message.substring(0, message.lastIndexOf('\n')));
        },
    };
    const skip = () => {
        const env = _config_1.NODE_ENV || 'development';
        return env !== 'development';
    };
    const morganMiddleware = (0, morgan_1.default)(_config_1.LOG_FORMAT !== null && _config_1.LOG_FORMAT !== void 0 ? _config_1.LOG_FORMAT : 'dev', { stream, skip });
    return morganMiddleware;
};
exports.Logger = Logger;
exports.logger = Logger.getInstance();
//# sourceMappingURL=logger.js.map