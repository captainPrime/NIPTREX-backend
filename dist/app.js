"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/ban-ts-comment */
const compression_1 = tslib_1.__importDefault(require("compression"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const express_1 = tslib_1.__importDefault(require("express"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const hpp_1 = tslib_1.__importDefault(require("hpp"));
const mongoose_1 = require("mongoose");
const swagger_jsdoc_1 = tslib_1.__importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = tslib_1.__importDefault(require("swagger-ui-express"));
const express_mongo_sanitize_1 = tslib_1.__importDefault(require("express-mongo-sanitize"));
const toobusy_js_1 = tslib_1.__importDefault(require("toobusy-js"));
const xss_clean_1 = tslib_1.__importDefault(require("xss-clean"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const _config_1 = require("@config");
const _databases_1 = require("@databases");
const error_middleware_1 = tslib_1.__importDefault(require("@middlewares/error.middleware"));
const logger_1 = require("@utils/logger");
const HttpException_1 = require("@exceptions/HttpException");
class App {
    constructor(routes) {
        this.app = (0, express_1.default)();
        this.env = _config_1.NODE_ENV || 'development';
        this.port = _config_1.PORT || 3000;
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeSwagger();
        this.initializeErrorHandling();
        this.server = (0, http_1.createServer)(this.app);
        this.io = new socket_io_1.Server(this.server);
        this.initializeSockets();
    }
    listen() {
        this.server.listen(this.port, () => {
            logger_1.logger.info(`=================================`);
            logger_1.logger.info(`======= ENV: ${this.env} =======`);
            logger_1.logger.info(`🚀 App listening on the port ${this.port}`);
            logger_1.logger.info(`=================================`);
        });
    }
    getServer() {
        return this.app;
    }
    connectToDatabase() {
        if (this.env !== 'production') {
            (0, mongoose_1.set)('debug', true);
        }
        // @ts-ignore
        (0, mongoose_1.connect)(_databases_1.dbConnection.url, _databases_1.dbConnection.options)
            .then(() => {
            logger_1.logger.info('Connected to Database Successfully...');
        })
            .catch(error => {
            logger_1.logger.error(`Error connecting to Database: ${error}`);
        });
    }
    initializeMiddlewares() {
        this.app.use(logger_1.Logger.getHttpLoggerInstance());
        this.app.use((0, cors_1.default)({ origin: _config_1.ORIGIN, credentials: _config_1.HAS_CREDENTIALS }));
        this.app.use((0, hpp_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use((0, xss_clean_1.default)());
        this.app.use((0, express_mongo_sanitize_1.default)());
        this.app.use((0, compression_1.default)());
        this.app.use(express_1.default.json({ limit: '50kb' }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cookie_parser_1.default)());
        this.app.use((req, res, next) => {
            if ((0, toobusy_js_1.default)()) {
                new HttpException_1.ServiceUnavailableError('Server too busy!');
            }
            else {
                next();
            }
        });
    }
    initializeRoutes(routes) {
        routes.forEach(route => {
            this.app.use('/', route.router);
        });
    }
    initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'NIPTREX',
                    version: '1.0.0',
                    description: 'API Documentation',
                },
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                        },
                    },
                },
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
            },
            apis: ['swagger.yaml'],
        };
        const specs = (0, swagger_jsdoc_1.default)(options);
        this.app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
    }
    initializeErrorHandling() {
        this.app.use((req, res, next) => next(new HttpException_1.NotFoundError(req.path)));
        this.app.use(error_middleware_1.default.handleError());
    }
    initializeSockets() {
        this.io.on('connection', (socket) => {
            logger_1.logger.info('New socket connection:', socket.id);
            socket.on('chat message', (message) => {
                logger_1.logger.info('Message:', message);
                this.io.emit('chat message', message);
            });
            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map