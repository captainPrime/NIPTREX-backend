import { paginate } from '@/modules/paginate';
import { toJSON } from '@/modules/toJSON';
import { Schema, model, Document } from 'mongoose';

export interface IPhotography extends Document {
  image: string;
  cloudinary_id: string;
}

const photographySchema = new Schema<IPhotography>({
  image: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
});

photographySchema.plugin(toJSON);
photographySchema.plugin(paginate);

export type IUpdateInvoice = Partial<IPhotography>;

const Photography = model<IPhotography>('Photography', photographySchema);

export { Photography };
