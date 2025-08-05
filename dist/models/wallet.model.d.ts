/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/inferschematype" />
import { Schema, Document } from 'mongoose';
export interface IWallet extends Document {
    user_id: string;
    amount: string;
    currency: string;
    account_number: string;
    account_status: string;
    bank_name: string;
    order_ref: string;
    flw_ref: string;
    expiry_date: string | number;
}
export interface ITransaction extends Document {
    user_id: string | Schema.Types.ObjectId;
    proposal_id: string | Schema.Types.ObjectId;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    status: string;
    photography: string;
    payment_type: string;
    created_at: Date;
    customer_id: string;
    customer_name: string;
    customer_email: string;
    nuban?: string;
    bank?: string;
    bank_name?: string;
    card_first_6digits?: string;
    card_last_4digits?: string;
    card_issuer?: string;
    card_country?: string;
    card_type?: string;
    card_expiry?: string;
}
export type IUpdateWallet = Partial<IWallet>;
export declare const WalletModel: import("mongoose").Model<IWallet, {}, {}, {}, any>;
export declare const TransactionModel: import("mongoose").Model<ITransaction, {}, {}, {}, any>;
