import { paginate } from '@/modules/paginate';
import { toJSON } from '@/modules/toJSON';
import { Document, Schema, model } from 'mongoose';

export interface IRating extends Document {
  entity_type: Schema.Types.ObjectId | string;
  entity_id: Schema.Types.ObjectId | string;
  rating_value: number;
  comment?: string;
}

const ratingSchema = new Schema<IRating>({
  entity_type: { type: String, required: true },
  entity_id: { type: Schema.Types.ObjectId, required: true },
  rating_value: { type: Number, required: true, default: 0 },
  comment: { type: String },
});

ratingSchema.plugin(toJSON);
ratingSchema.plugin(paginate);

const RatingModel = model<IRating>('Rating', ratingSchema);

export { RatingModel };
