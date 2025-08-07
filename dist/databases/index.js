"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const _config_1 = require("../config");
const connectionString = process.env.NODE_ENV === 'production' ? _config_1.MONGODB_URI : _config_1.MONGODB_URI_DEV;
exports.dbConnection = {
    url: connectionString !== null && connectionString !== void 0 ? connectionString : _config_1.MONGODB_URI,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};
//# sourceMappingURL=index.js.map