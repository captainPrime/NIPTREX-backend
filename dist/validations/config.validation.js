"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configUpdateValidation = exports.configSchemaValidation = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
/*
|--------------------------------------------------------------------------
| Config Validation
|--------------------------------------------------------------------------
*/
exports.configSchemaValidation = joi_1.default.object({
    key: joi_1.default.string().required(),
    value: joi_1.default.string().required(),
});
exports.configUpdateValidation = joi_1.default.object({
    key: joi_1.default.string(),
    value: joi_1.default.string(),
}).min(1);
//# sourceMappingURL=config.validation.js.map