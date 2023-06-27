import mongoose, { Document, Schema } from 'mongoose';

interface Rating extends Document {
  entity_type: Schema.Types.ObjectId | string;
  entity_id: Schema.Types.ObjectId | string;
  rating_value: number;
  comment?: string;
}

const ratingSchema = new Schema<Rating>({
  entity_type: { type: String, required: true },
  entity_id: { type: Schema.Types.ObjectId, required: true },
  rating_value: { type: Number, required: true },
  comment: { type: String },
});

export default mongoose.model<Rating>('Rating', ratingSchema);
