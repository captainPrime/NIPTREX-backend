import { paginate } from '@/modules/paginate';
import { toJSON } from '@/modules/toJSON';
import { Schema, model, Document, ObjectId } from 'mongoose';

export interface IPhotography extends Document {
  image: string;
  cloudinary_id: string;
  user_id: string | ObjectId;
}

const photographySchema = new Schema<IPhotography>({
  image: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

photographySchema.plugin(toJSON);
photographySchema.plugin(paginate);

export type IUpdateInvoice = Partial<IPhotography>;

const Photography = model<IPhotography>('Photography', photographySchema);

export { Photography };
