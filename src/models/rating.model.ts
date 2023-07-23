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

const ratingSchema = new Schema<IRating>(
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

ratingSchema.post('save', async function (rating) {
  try {
    const user = await User.findById(rating.user_id);

    console.log('USER IN RATE HOOK', user);

    if (!user) {
      console.error('User not found');
      return;
    }

    // Find all the ratings for the user
    const ratings = await RatingModel.find({ user_id: rating.user_id });

    console.log('USER_RATINGS', ratings);

    // Calculate the average rating
    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((total, r) => total + r.rating_value, 0);
    const averageRating = sumRatings / totalRatings;

    // Update the user model with the average rating
    user.rating = averageRating;
    await user.save();
  } catch (error) {
    console.error('Error updating average rating:', error);
  }
});

export { RatingModel };
