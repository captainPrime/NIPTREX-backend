"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.photographyUpdateValidation = exports.photographySchemaValidation = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
/*
|--------------------------------------------------------------------------
| Photography Validation
|--------------------------------------------------------------------------
*/
exports.photographySchemaValidation = joi_1.default.object({
    image: joi_1.default.object().optional(),
    title: joi_1.default.string().required(),
    price: joi_1.default.string().required(),
    category: joi_1.default.alternatives()
        .try(joi_1.default.array().items(joi_1.default.string()), // e.g. ["Nature", "Portrait"]
    joi_1.default.string())
        .optional(),
    tags: joi_1.default.alternatives()
        .try(joi_1.default.array().items(joi_1.default.string()), // e.g. ["sunset", "hdr"]
    joi_1.default.string())
        .optional(),
    licence: joi_1.default.string().optional(),
    listAsNFT: joi_1.default.boolean().truthy('true').falsy('false').optional(), // "true"/"false" string from form-data
});
exports.photographyUpdateValidation = joi_1.default.object({
    cloudinary_id: joi_1.default.string(),
    image: joi_1.default.string(),
}).min(1);
//# sourceMappingURL=photography.validation.js.map