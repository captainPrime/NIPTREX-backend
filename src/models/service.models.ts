import { Schema, Document, model, Types } from 'mongoose';
import { toJSON } from '@/modules/toJSON';

export interface IService extends Document {
  user_id: string | Types.ObjectId | any;
  title: string;
  headline: string;
  description: string;
  projects: string[];
  services: string[];
  price: {
    basic: {
      rate: string;
      duration: string;
      services: string[];
    };
    standard: {
      rate: string;
      duration: string;
      services: string[];
    };
    premium: {
      rate: string;
      duration: string;
      services: string[];
    };
  };
}

const serviceSchema: Schema<IService> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    headline: { type: String, required: true },
    description: { type: String, required: true },
    projects: [{ type: String, required: true }],
    services: [{ type: String, required: false }],
    price: {
      basic: {
        rate: { type: String },
        duration: { type: String },
        services: [{ type: String }],
      },
      standard: {
        rate: { type: String },
        duration: { type: String },
        services: [{ type: String }],
      },
      premium: {
        rate: { type: String },
        duration: { type: String },
        services: [{ type: String }],
      },
    },
  },
  { versionKey: false },
);

serviceSchema.plugin(toJSON);

export type IUpdateService = Partial<IService>;

export const ServiceModel = model<IService>('Service', serviceSchema);
