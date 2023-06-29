import { paginate } from '@/modules/paginate';
import { toJSON } from '@/modules/toJSON';
import { Document, Schema, model, Model } from 'mongoose';

export enum EntityName {
  User = 'User',
  Job = 'Job',
  Service = 'Service',
}

export interface IRating extends Document {
  entity: Schema.Types.ObjectId | string; // Updated field name
  reviewer: Schema.Types.ObjectId | string;
  rating_value: number;
  comment?: string;
  entity_name: EntityName; // Updated field type
}

const ratingSchema = new Schema<IRating>({
  entity: { type: Schema.Types.ObjectId, required: true, refPath: 'entityModel' }, // Updated field with refPath
  reviewer: { type: Schema.Types.ObjectId, required: true },
  rating_value: { type: Number, required: true, default: 0 },
  comment: { type: String },
  entity_name: { type: String, required: true, enum: Object.values(EntityName) }, // Updated field with enum
});

ratingSchema.plugin(toJSON);
ratingSchema.plugin(paginate);

ratingSchema.virtual('entityModel', {
  ref: function (this: IRating) {
    return this.entity_name; // Virtual field for dynamic reference based on entity_name
  },
  localField: 'entity',
  foreignField: '_id',
  justOne: true,
});

const RatingModel: Model<IRating> = model<IRating>('Rating', ratingSchema);

export { RatingModel };
