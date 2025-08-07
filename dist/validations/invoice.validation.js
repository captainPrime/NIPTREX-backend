"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceUpdateSchema = exports.invoiceSchema = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
exports.invoiceSchema = joi_1.default.object({
    title: joi_1.default.string(),
    package: joi_1.default.array().items(joi_1.default.string().required()),
    promo_code: joi_1.default.string().optional(),
    proposal_id: joi_1.default.string().required(),
    user_id: joi_1.default.string().required(),
    total: joi_1.default.number().optional(),
    service_fee: joi_1.default.number().optional(),
    vat: joi_1.default.number().optional(),
});
exports.invoiceUpdateSchema = joi_1.default.object({
    title: joi_1.default.string(),
    package: joi_1.default.array().items(joi_1.default.string().required()),
    promo_code: joi_1.default.string().optional(),
    total: joi_1.default.number(),
    service_fee: joi_1.default.number(),
    vat: joi_1.default.number(),
});
//# sourceMappingURL=invoice.validation.js.map