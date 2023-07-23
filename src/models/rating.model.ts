import { toJSON } from '@/modules/toJSON';
import { paginate } from '@/modules/paginate';
import { Document, Schema, model, Model } from 'mongoose';
import User from './users.model';

export interface IRating extends Document {
  user_id: Schema.Types.ObjectId | string;
  reviewer: Schema.Types.ObjectId | string;
  reviewer_location: string;
  rating_value: number;
  comment: string;
}

const ratingSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    reviewer: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    reviewer_location: { type: String, required: true },
    rating_value: { type: Number, required: true, default: 0 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

ratingSchema.plugin(toJSON);
ratingSchema.plugin(paginate);


const RatingModel: Model<IRating> = model<IRating>('Rating', ratingSchema);

export { RatingModel };
