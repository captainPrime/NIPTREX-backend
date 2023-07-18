import { Schema, model, Document } from 'mongoose';

interface IPackage {
  package: string[];
}

export interface IInvoice extends Document {
  title: string;
  package: IPackage;
  promo_code?: string;
  total: number;
  service_fee: number;
  VAT: number;
}

const invoiceSchema = new Schema<IInvoice>({
  title: { type: String, required: true },
  package: [
    {
      type: String,
      required: true,
    },
  ],
  promo_code: { type: String },
  total: { type: Number, required: true },
  service_fee: { type: Number, required: true },
  VAT: { type: Number, required: true },
});

export type IUpdateInvoice = Partial<IInvoice>;

const Invoice = model<IInvoice>('Invoice', invoiceSchema);

export { Invoice };
