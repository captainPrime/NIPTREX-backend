"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSchemaValidation = exports.chatSchemaValidation = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
// Chat Validation Schema
exports.chatSchemaValidation = joi_1.default.object({
    participants: joi_1.default.array().items(joi_1.default.string()).required(),
    milestone: joi_1.default.string().required(),
});
// Message Validation Schema
exports.messageSchemaValidation = joi_1.default.object({
    sender: joi_1.default.string().required(),
    chatId: joi_1.default.string().required(),
    content: joi_1.default.string().when('is_file', {
        is: false,
        then: joi_1.default.string().optional(),
        otherwise: joi_1.default.string().allow('').optional(),
    }),
    is_file: joi_1.default.boolean().optional().default(false),
    files: joi_1.default.when('is_file', {
        is: true,
        then: joi_1.default.array()
            .items(joi_1.default.object({
            name: joi_1.default.string().optional(),
            url: joi_1.default.string().optional(),
        }))
            .min(1)
            .optional(),
        otherwise: joi_1.default.array().max(0).optional(),
    }),
    createdAt: joi_1.default.date().default(Date.now),
});
//# sourceMappingURL=chat.validation.js.map