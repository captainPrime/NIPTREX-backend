"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAdminPanel = void 0;
const tslib_1 = require("tslib");
const adminjs_1 = tslib_1.__importDefault(require("adminjs"));
const AdminJSExpress = tslib_1.__importStar(require("@adminjs/express"));
const AdminJSMongoose = tslib_1.__importStar(require("@adminjs/mongoose"));
const users_model_1 = tslib_1.__importDefault(require("./models/users.model"));
const job_model_1 = require("./models/job.model");
const bid_model_1 = require("./models/bid.model");
const chat_model_1 = require("./models/chat.model");
const config_model_1 = require("./models/config.model");
const invoice_model_1 = require("./models/invoice.model");
const photography_model_1 = require("./models/photography.model");
// import { Profile } from './models/profile.model';
const rating_model_1 = require("./models/rating.model");
const service_models_1 = require("./models/service.models");
const wallet_model_1 = require("./models/wallet.model");
// Register the AdminJS Mongoose adapter
adminjs_1.default.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
});
const adminJs = new adminjs_1.default({
    rootPath: '/admin',
    resources: [
        { resource: users_model_1.default },
        { resource: job_model_1.JobModel },
        { resource: bid_model_1.BiddingModel },
        { resource: chat_model_1.ChatModel },
        { resource: config_model_1.Config },
        { resource: invoice_model_1.Invoice },
        { resource: photography_model_1.Photography },
        // { resource: Profile },
        { resource: rating_model_1.RatingModel },
        { resource: service_models_1.ServiceModel },
        { resource: wallet_model_1.WalletModel },
    ],
});
const ADMIN = {
    email: 'admin@example.com',
    password: 'securepassword',
};
const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (email, password) => {
        if (email === ADMIN.email && password === ADMIN.password) {
            return ADMIN;
        }
        return null;
    },
    cookieName: 'adminjs',
    cookiePassword: 'some-secret-password',
});
const setupAdminPanel = (app) => {
    app.use(adminJs.options.rootPath, router);
};
exports.setupAdminPanel = setupAdminPanel;
//# sourceMappingURL=Admin.js.map