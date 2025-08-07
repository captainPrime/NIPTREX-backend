"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = tslib_1.__importDefault(require("./app"));
const job_route_1 = tslib_1.__importDefault(require("./routes/job.route"));
const chat_route_1 = tslib_1.__importDefault(require("./routes/chat.route"));
const auth_route_1 = tslib_1.__importDefault(require("./routes/auth.route"));
const index_route_1 = tslib_1.__importDefault(require("./routes/index.route"));
const users_route_1 = tslib_1.__importDefault(require("./routes/users.route"));
const validateEnv_1 = tslib_1.__importDefault(require("./utils/validateEnv"));
const error_middleware_1 = tslib_1.__importDefault(require("./middlewares/error.middleware"));
const profile_route_1 = tslib_1.__importDefault(require("./routes/profile.route"));
const bid_route_1 = tslib_1.__importDefault(require("./routes/bid.route"));
const wallet_route_1 = tslib_1.__importDefault(require("./routes/wallet.route"));
const service_route_1 = tslib_1.__importDefault(require("./routes/service.route"));
const rating_route_1 = tslib_1.__importDefault(require("./routes/rating.route"));
const invoice_route_1 = tslib_1.__importDefault(require("./routes/invoice.route"));
const photography_route_1 = tslib_1.__importDefault(require("./routes/photography.route"));
const config_route_1 = tslib_1.__importDefault(require("./routes/config.route"));
(0, validateEnv_1.default)();
const app = new app_1.default([
    new index_route_1.default(),
    new users_route_1.default(),
    new auth_route_1.default(),
    new profile_route_1.default(),
    new job_route_1.default(),
    new bid_route_1.default(),
    new chat_route_1.default(),
    new wallet_route_1.default(),
    new service_route_1.default(),
    new rating_route_1.default(),
    new invoice_route_1.default(),
    new photography_route_1.default(),
    new config_route_1.default(),
]);
app.listen();
error_middleware_1.default.initializeUnhandledException();
process.on('SIGTERM', () => {
    console.info('SIGTERM received');
});
//# sourceMappingURL=server.js.map