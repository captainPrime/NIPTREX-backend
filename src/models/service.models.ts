import { Schema, Document, model, Types } from 'mongoose';
import { toJSON } from '@/modules/toJSON';

interface IServiceProject {
  name: string;
  url: string;
}

interface IServicePrice {
  rate: number;
  duration: number;
  services: string[];
}

export interface IService extends Document {
  user_id: Schema.Types.ObjectId;
  title: string;
  headline: string;
  description: string;
  projects: IServiceProject[];
  services: string[];
  tools: string[];
  price: {
    basic: IServicePrice;
    standard: IServicePrice;
    premium: IServicePrice;
  };
}

const serviceSchema: Schema<IService> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    headline: { type: String, required: true },
    description: { type: String, required: true },
    projects: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],
    services: [{ type: String, required: false }],
    tools: [{ type: String, required: false }],
    price: {
      basic: {
        rate: { type: Number },
        duration: { type: Number },
        services: [{ type: String }],
      },
      standard: {
        rate: { type: Number },
        duration: { type: Number },
        services: [{ type: String }],
      },
      premium: {
        rate: { type: Number },
        duration: { type: Number },
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
