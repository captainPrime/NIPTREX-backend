import { paginate } from '@/modules/paginate';
import { toJSON } from '@/modules/toJSON';
import { Schema, model, Document, ObjectId } from 'mongoose';

export interface IPhotography extends Document {
  image: string | any;
  title: string | any;
  price: string | any;
  cloudinary_id: string | any;
  user_id: string | ObjectId;
  category: string[];
  tags: string[];
  licence: string;
  listAsNFT: boolean;
}

const photographySchema = new Schema<IPhotography>({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: [String],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  licence: {
    type: String,
    default: '',
  },
  listAsNFT: {
    type: Boolean,
    default: false,
  },
});

photographySchema.plugin(toJSON);
photographySchema.plugin(paginate);

export type IUpdateInvoice = Partial<IPhotography>;

const Photography = model<IPhotography>('Photography', photographySchema);

export { Photography };
