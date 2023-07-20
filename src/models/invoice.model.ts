import { Schema, model, Document } from 'mongoose';

interface IPackage {
  package: string[];
}

export interface IInvoice extends Document {
  title?: string;
  package?: IPackage;
  promo_code?: string;
  total?: number;
  service_fee?: number;
  proposal_id: string;
  vat?: number;
}

const invoiceSchema = new Schema<IInvoice>({
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

export type IUpdateInvoice = Partial<IInvoice>;

const Invoice = model<IInvoice>('Invoice', invoiceSchema);

export { Invoice };
