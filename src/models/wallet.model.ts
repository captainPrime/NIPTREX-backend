import { Schema, Document, model } from 'mongoose';
import { toJSON } from '@/modules/toJSON';

// Define the Wallet schema
export interface IWallet extends Document {
  user_id: string;
  balance: number;
  currency: string;
}

const walletSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    currency: { type: String, required: true },
    balance: { type: Number, required: false, default: 0 },
  },
  { versionKey: false },
);

walletSchema.plugin(toJSON);

// Define the Transaction schema
export interface ITransaction extends Document {
  user_id: string;
  wallet_id: string;
  name: string;
  remark: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  timestamp: Date;
}

const transactionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    wallet_id: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    remark: { type: String, required: true },
    type: { type: String, enum: ['deposit', 'withdrawal', 'transfer'], required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

transactionSchema.plugin(toJSON);

export type IUpdateWallet = Partial<IWallet>;

// Create and export the Wallet and Transaction models
export const WalletModel = model<IWallet>('Wallet', walletSchema);
export const TransactionModel = model<ITransaction>('Transaction', transactionSchema);
