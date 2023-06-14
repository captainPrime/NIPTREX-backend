import { Schema, Document, model } from 'mongoose';
import { toJSON } from '@/modules/toJSON';

// Define the Wallet schema
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

const walletSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    currency: { type: String, required: true },
    expiry_date: { type: String, required: true },
    account_number: { type: String, required: true },
    account_status: { type: String, required: true },
    bank_name: { type: String, required: true },
    order_ref: { type: String, required: true },
    flw_ref: { type: String, required: true },
    amount: { type: String, required: false, default: '0' },
  },
  { versionKey: false },
);

walletSchema.plugin(toJSON);

// Define the Transaction schema
export interface ITransaction extends Document {
  user_id: string | Schema.Types.ObjectId;
  proposal_id: string | Schema.Types.ObjectId;
  tx_ref: string;
  flw_ref: string;
  amount: number;
  currency: string;
  status: string;
  payment_type: string;
  created_at: Date;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  nuban?: string;
  bank?: string;
  card_first_6digits?: string;
  card_last_4digits?: string;
  card_issuer?: string;
  card_country?: string;
  card_type?: string;
  card_expiry?: string;
}

const transactionSchema: Schema<ITransaction> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    proposal_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tx_ref: { type: String, required: true },
    flw_ref: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    payment_type: { type: String, required: true },
    created_at: { type: Date, required: true },
    customer_id: { type: Number, required: true },
    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    nuban: {
      type: String,
      required: function (this: ITransaction) {
        return this.payment_type === 'bank_transfer';
      },
    },
    bank: {
      type: String,
      required: function (this: ITransaction) {
        return this.payment_type === 'bank_transfer';
      },
    },
    card_first_6digits: {
      type: String,
      required: function (this: ITransaction) {
        return this.payment_type === 'card';
      },
    },
    card_last_4digits: {
      type: String,
      required: function (this: ITransaction) {
        return this.payment_type === 'card';
      },
    },
    card_issuer: {
      type: String,
      required: function (this: ITransaction) {
        return this.payment_type === 'card';
      },
    },
    card_country: {
      type: String,
      required: function (this: ITransaction) {
        return this.payment_type === 'card';
      },
    },
    card_type: {
      type: String,
      required: function (this: ITransaction) {
        return this.payment_type === 'card';
      },
    },
    card_expiry: {
      type: String,
      required: function (this: ITransaction) {
        return this.payment_type === 'card';
      },
    },
  },
  { versionKey: false },
);

transactionSchema.plugin(toJSON);

export type IUpdateWallet = Partial<IWallet>;

// Create and export the Wallet and Transaction models
export const WalletModel = model<IWallet>('Wallet', walletSchema);
export const TransactionModel = model<ITransaction>('Transaction', transactionSchema);
