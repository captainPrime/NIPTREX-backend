import { toJSON } from '@/modules/toJSON';
import { paginate } from '@/modules/paginate';
import { Document, Schema, model, Model } from 'mongoose';

export interface IRating extends Document {
  user_id: Schema.Types.ObjectId | string;
  reviewer: Schema.Types.ObjectId | string;
  rating_value: number;
  comment: string;
}

const ratingSchema = new Schema<IRating>({
  user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  reviewer: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  rating_value: { type: Number, required: true, default: 0 },
  comment: { type: String, required: true },
});

ratingSchema.plugin(toJSON);
ratingSchema.plugin(paginate);

const RatingModel: Model<IRating> = model<IRating>('Rating', ratingSchema);

export { RatingModel };
