import { Schema, Document, model, Types } from 'mongoose';
import { toJSON } from '@/modules/toJSON';

export interface IService extends Document {
  user_id: Types.ObjectId | any;
  image: string[];
  name: string;
  level: number;
  location: string;
  description: string;
  price: string;
}

const serviceSchema: Schema<IService> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: [{ type: String, required: true }],
    name: { type: String, required: true },
    level: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
  },
  { versionKey: false },
);

serviceSchema.plugin(toJSON);

export type IUpdateService = Partial<IService>;

export const ServiceModel = model<IService>('Service', serviceSchema);
