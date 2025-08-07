"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = exports.WalletModel = void 0;
const mongoose_1 = require("mongoose");
const toJSON_1 = require("@/modules/toJSON");
const walletSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    currency: { type: String, required: true },
    expiry_date: { type: String, required: true },
    account_number: { type: String, required: true },
    account_status: { type: String, required: true },
    bank_name: { type: String, required: true },
    order_ref: { type: String, required: true },
    flw_ref: { type: String, required: true },
    amount: { type: String, required: false, default: '0' },
}, { versionKey: false });
walletSchema.plugin(toJSON_1.toJSON);
const transactionSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    proposal_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    tx_ref: { type: String, required: true },
    flw_ref: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    payment_type: { type: String, required: true },
    created_at: { type: Date, required: true },
    customer_id: { type: String, required: true },
    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    photography: { type: String, required: false },
    nuban: {
        type: String,
        required: function () {
            return this.payment_type === 'bank_transfer';
        },
    },
    bank: {
        type: String,
        required: function () {
            return this.payment_type === 'bank_transfer';
        },
    },
    bank_name: {
        type: String,
        required: function () {
            return this.payment_type === 'bank_transfer';
        },
    },
    card_first_6digits: {
        type: String,
        required: function () {
            return this.payment_type === 'card';
        },
    },
    card_last_4digits: {
        type: String,
        required: function () {
            return this.payment_type === 'card';
        },
    },
    card_issuer: {
        type: String,
        required: function () {
            return this.payment_type === 'card';
        },
    },
    card_country: {
        type: String,
        required: function () {
            return this.payment_type === 'card';
        },
    },
    card_type: {
        type: String,
        required: function () {
            return this.payment_type === 'card';
        },
    },
    card_expiry: {
        type: String,
        required: function () {
            return this.payment_type === 'card';
        },
    },
}, { versionKey: false });
transactionSchema.plugin(toJSON_1.toJSON);
// Create and export the Wallet and Transaction models
exports.WalletModel = (0, mongoose_1.model)('Wallet', walletSchema);
exports.TransactionModel = (0, mongoose_1.model)('Transaction', transactionSchema);
//# sourceMappingURL=wallet.model.js.map