"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionValidationSchema = exports.chargeCardSchemaValidation = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
// Message Validation Schema
exports.chargeCardSchemaValidation = joi_1.default.object({
    card_number: joi_1.default.string().creditCard().required(),
    cvv: joi_1.default.string().length(3).required(),
    expiry_month: joi_1.default.string().length(2).required(),
    expiry_year: joi_1.default.string().length(2).required(),
    currency: joi_1.default.string().required(),
    amount: joi_1.default.string().required(),
    redirect_url: joi_1.default.string().uri().required(),
    fullname: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phone_number: joi_1.default.string().required(),
    tx_ref: joi_1.default.string().required(),
});
exports.transactionValidationSchema = joi_1.default.object({
    user_id: joi_1.default.string().required(),
    proposal_id: joi_1.default.string().required(),
    tx_ref: joi_1.default.string().required(),
    flw_ref: joi_1.default.string().required(),
    amount: joi_1.default.number().required(),
    currency: joi_1.default.string().required(),
    status: joi_1.default.string().required(),
    photography: joi_1.default.string().optional(),
    payment_type: joi_1.default.string().valid('bank_transfer', 'card', 'account', 'ussd').required(),
    created_at: joi_1.default.date().required(),
    customer_id: joi_1.default.string().required(),
    customer_name: joi_1.default.string().required(),
    customer_email: joi_1.default.string().email().required(),
    nuban: joi_1.default.string().when('payment_type', { is: 'bank_transfer', then: joi_1.default.required().empty().allow('') }),
    bank: joi_1.default.string().when('payment_type', { is: 'bank_transfer', then: joi_1.default.required().empty().allow('') }),
    bank_name: joi_1.default.string().when('payment_type', { is: 'bank_transfer', then: joi_1.default.required().empty().allow('') }),
    card_first_6digits: joi_1.default.string().when('payment_type', { is: 'card', then: joi_1.default.required().empty().allow('') }),
    card_last_4digits: joi_1.default.string().when('payment_type', { is: 'card', then: joi_1.default.required().empty().allow('') }),
    card_issuer: joi_1.default.string().when('payment_type', { is: 'card', then: joi_1.default.required().empty().allow('') }),
    card_country: joi_1.default.string().when('payment_type', { is: 'card', then: joi_1.default.required().empty().allow('') }),
    card_type: joi_1.default.string().when('payment_type', { is: 'card', then: joi_1.default.required().empty().allow('') }),
    card_expiry: joi_1.default.string().when('payment_type', { is: 'card', then: joi_1.default.required().empty().allow('') }),
    timestamp: joi_1.default.date().default(Date.now),
});
//# sourceMappingURL=payment.validation.js.map