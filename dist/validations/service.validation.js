"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceProposalStatusValidation = exports.serviceUpdateValidationSchema = exports.serviceValidationSchema = void 0;
const tslib_1 = require("tslib");
const service_models_1 = require("../models/service.models");
const joi_1 = tslib_1.__importDefault(require("joi"));
exports.serviceValidationSchema = joi_1.default.object({
    user_id: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    headline: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    projects: joi_1.default.array().items(joi_1.default.object({
        name: joi_1.default.string(),
        url: joi_1.default.string(),
    })),
    services: joi_1.default.array().items(joi_1.default.string().optional()),
    category: joi_1.default.array().items(joi_1.default.string().optional()),
    tools: joi_1.default.array().items(joi_1.default.string().optional()),
    price: joi_1.default.object({
        basic: joi_1.default.object({
            rate: joi_1.default.number(),
            duration: joi_1.default.number(),
            services: joi_1.default.array().items(joi_1.default.string()),
        }),
        standard: joi_1.default.object({
            rate: joi_1.default.number(),
            duration: joi_1.default.number(),
            services: joi_1.default.array().items(joi_1.default.string()),
        }),
        premium: joi_1.default.object({
            rate: joi_1.default.number(),
            duration: joi_1.default.number(),
            services: joi_1.default.array().items(joi_1.default.string()),
        }),
    }),
    featured: joi_1.default.boolean().optional(),
});
exports.serviceUpdateValidationSchema = joi_1.default.object({
    title: joi_1.default.string(),
    headline: joi_1.default.string(),
    description: joi_1.default.string(),
    projects: joi_1.default.array().items(joi_1.default.object({
        name: joi_1.default.string(),
        url: joi_1.default.string(),
    })),
    services: joi_1.default.array().items(joi_1.default.string().optional()),
    category: joi_1.default.array().items(joi_1.default.string().optional()),
    tools: joi_1.default.array().items(joi_1.default.string().optional()),
    price: joi_1.default.object({
        basic: joi_1.default.object({
            rate: joi_1.default.number(),
            duration: joi_1.default.number(),
            services: joi_1.default.array().items(joi_1.default.string()),
        }),
        standard: joi_1.default.object({
            rate: joi_1.default.number(),
            duration: joi_1.default.number(),
            services: joi_1.default.array().items(joi_1.default.string()),
        }),
        premium: joi_1.default.object({
            rate: joi_1.default.number(),
            duration: joi_1.default.number(),
            services: joi_1.default.array().items(joi_1.default.string()),
        }),
    }),
    featured: joi_1.default.boolean().optional(),
}).min(1);
exports.updateServiceProposalStatusValidation = joi_1.default.object({
    status: joi_1.default.string()
        .valid(...Object.values(service_models_1.ServiceProposalStatus))
        .optional(),
}).min(1);
//# sourceMappingURL=service.validation.js.map