"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const paginate_1 = require("@/modules/paginate");
const toJSON_1 = require("@/modules/toJSON");
const mongoose_1 = require("mongoose");
const configSchema = new mongoose_1.Schema({
    key: { type: String, required: true },
    value: { type: String, required: true },
});
configSchema.plugin(toJSON_1.toJSON);
configSchema.plugin(paginate_1.paginate);
const Config = (0, mongoose_1.model)('Config', configSchema);
exports.Config = Config;
//# sourceMappingURL=config.model.js.map