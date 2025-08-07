"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const databases_1 = require("@/databases");
const setupTestDB = () => {
    beforeAll(async () => {
        await mongoose_1.default.connect(databases_1.dbConnection.url);
    });
    beforeEach(async () => {
        await Promise.all(Object.values(mongoose_1.default.connection.collections).map(async (collection) => collection.deleteMany({})));
    });
    afterAll(async () => {
        await mongoose_1.default.disconnect();
    });
};
exports.default = setupTestDB;
//# sourceMappingURL=setupTestDB.js.map