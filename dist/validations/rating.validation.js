"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingUpdateValidationSchema = exports.ratingValidationSchema = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
exports.ratingValidationSchema = joi_1.default.object({
    user_id: joi_1.default.string().required(),
    reviewer: joi_1.default.string().required(),
    reviewer_location: joi_1.default.string().required(),
    rating_value: joi_1.default.number().integer().min(1).max(5).required(),
    comment: joi_1.default.string().required(),
});
exports.ratingUpdateValidationSchema = joi_1.default.object({
    rating_value: joi_1.default.number().min(0),
    reviewer_location: joi_1.default.string(),
    comment: joi_1.default.string().allow('').optional(),
}).min(1);
//# sourceMappingURL=rating.validation.js.map