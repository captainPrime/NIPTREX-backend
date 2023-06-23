import { Schema, Document, model, Types } from 'mongoose';
import { toJSON } from '@/modules/toJSON';

export interface IService extends Document {
  user_id: string | Types.ObjectId | any;
  title: string;
  headline: string;
  description: string;
  projects: string[];
  services: string[];
  tools: string[];
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
    tools: [{ type: String, required: false }],
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

const HireServiceSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

serviceSchema.plugin(toJSON);
HireServiceSchema.plugin(toJSON);

export type IUpdateService = Partial<IService>;

const ServiceModel = model<IService>('Service', serviceSchema);
const HireServiceModel = model<any>('HireService', HireServiceSchema);

export { ServiceModel, HireServiceModel };
