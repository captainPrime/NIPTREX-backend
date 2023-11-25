import { paginate } from '@/modules/paginate';
import { toJSON } from '@/modules/toJSON';
import { Schema, model, Document } from 'mongoose';

export interface IConfig extends Document {
  key: string;
  value: string;
}

const configSchema = new Schema<IConfig>({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

configSchema.plugin(toJSON);
configSchema.plugin(paginate);

export type IUpdateConfig = Partial<IConfig>;

const Config = model<IConfig>('Config', configSchema);

export { Config };
