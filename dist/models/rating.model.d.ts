import { Document, Schema, Model } from 'mongoose';
export interface IRating extends Document {
    user_id: Schema.Types.ObjectId | string;
    reviewer: Schema.Types.ObjectId | string;
    reviewer_location: string;
    rating_value: number;
    comment: string;
}
declare const RatingModel: Model<IRating>;
export { RatingModel };
