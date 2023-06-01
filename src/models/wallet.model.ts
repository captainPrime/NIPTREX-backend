import { Schema, Document, model } from 'mongoose';
import { toJSON } from '@/modules/toJSON';

// Define the Wallet schema
export interface IWallet extends Document {
  userId: string;
  balance: number;
  transactions: ITransaction[];
}

const walletSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    currency: { type: String, required: true },
    balance: { type: Number, required: true },
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
  },
  { versionKey: false },
);

walletSchema.plugin(toJSON);

// Define the Transaction schema
export interface ITransaction extends Document {
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  timestamp: Date;
}

const transactionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['deposit', 'withdrawal', 'transfer'], required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

transactionSchema.plugin(toJSON);

// Create and export the Wallet and Transaction models
export const WalletModel = model<IWallet>('Wallet', walletSchema);
export const TransactionModel = model<ITransaction>('Transaction', transactionSchema);
