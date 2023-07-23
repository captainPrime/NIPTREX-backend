import { Schema, Document, model } from 'mongoose';
import { toJSON } from '@/modules/toJSON';
import { paginate } from '@/modules/paginate';

interface IServiceProject {
  name: string;
  url: string;
}

interface IServicePrice {
  rate: number;
  duration: number;
  services: string[];
}

export enum ServiceProposalStatus {
  NULL = 'null',
  PAID = 'paid',
  CLOSED = 'closed',
  APPLIED = 'applied',
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
}

export interface IService extends Document {
  user_id: Schema.Types.ObjectId;
  title: string;
  headline: string;
  description: string;
  rating: number;
  projects: IServiceProject[];
  services: string[];
  category: string[];
  tools: string[];
  price: {
    basic: IServicePrice;
    standard: IServicePrice;
    premium: IServicePrice;
  };
}

export interface IServiceProposal extends Document {
  amount: number;
  delivery_date: Date;
  package_type: string;
  service_id: string;
  status: ServiceProposalStatus;
  client_id: string;
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
    category: [{ type: String, required: true }],
    services: [{ type: String, required: false }],
    tools: [{ type: String, required: false }],
    rating: {
      type: Number,
      required: false,
      default: 0,
    },
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

const serviceProposalSchema: Schema = new Schema(
  {
    amount: { type: Number, required: true },
    delivery_date: { type: Date, required: true },
    package_type: { type: String, required: true },
    service_id: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    status: { type: String, enum: Object.values(ServiceProposalStatus), default: ServiceProposalStatus.APPLIED, required: true },
    client_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

const HireServiceSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    proposal: { type: Schema.Types.ObjectId, ref: 'ServiceProposal', required: true },
    status: { type: String, enum: Object.values(ServiceProposalStatus), default: ServiceProposalStatus.PAID, required: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

serviceSchema.plugin(toJSON);
serviceSchema.plugin(paginate);
HireServiceSchema.plugin(paginate);
HireServiceSchema.plugin(toJSON);
serviceProposalSchema.plugin(toJSON);
serviceProposalSchema.plugin(paginate);

export type IUpdateService = Partial<IService>;

const ServiceModel = model<IService>('Service', serviceSchema);
const HireServiceModel = model<any>('HireService', HireServiceSchema);
const ServiceProposalModel = model<IServiceProposal>('ServiceProposal', serviceProposalSchema);

export { ServiceModel, HireServiceModel, ServiceProposalModel };
