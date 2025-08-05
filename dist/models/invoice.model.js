"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
const paginate_1 = require("../modules/paginate");
const toJSON_1 = require("../modules/toJSON");
const mongoose_1 = require("mongoose");
const invoiceSchema = new mongoose_1.Schema({
    title: { type: String, required: false },
    proposal_id: { type: String, required: true },
    package: [
        {
            type: String,
            required: false,
        },
    ],
    promo_code: { type: String },
    total: { type: Number, required: false },
    service_fee: { type: Number, required: false },
    vat: { type: Number, required: false },
});
invoiceSchema.plugin(toJSON_1.toJSON);
invoiceSchema.plugin(paginate_1.paginate);
const Invoice = (0, mongoose_1.model)('Invoice', invoiceSchema);
exports.Invoice = Invoice;
//# sourceMappingURL=invoice.model.js.map