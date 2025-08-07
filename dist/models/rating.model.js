"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingModel = void 0;
const tslib_1 = require("tslib");
const toJSON_1 = require("@/modules/toJSON");
const paginate_1 = require("@/modules/paginate");
const mongoose_1 = require("mongoose");
const users_model_1 = tslib_1.__importDefault(require("./users.model"));
const ratingSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    reviewer: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    reviewer_location: { type: String, required: true },
    rating_value: { type: Number, required: true, default: 0 },
    comment: { type: String, required: true },
}, {
    timestamps: true,
});
ratingSchema.plugin(toJSON_1.toJSON);
ratingSchema.plugin(paginate_1.paginate);
const RatingModel = (0, mongoose_1.model)('Rating', ratingSchema);
exports.RatingModel = RatingModel;
ratingSchema.pre('save', async function (next) {
    try {
        // Find all the ratings for the user
        const ratings = await RatingModel.find({ user_id: this.user_id });
        console.log('USER_RATINGS', ratings);
        // Calculate the average rating
        const totalRatings = ratings.length;
        const sumRatings = ratings.reduce((total, r) => total + r.rating_value, 0);
        const averageRating = sumRatings / totalRatings;
        await users_model_1.default.findByIdAndUpdate(this.user_id, { rating: averageRating }, {
            new: true,
            runValidators: true,
        });
        next();
    }
    catch (error) {
        console.error('Error updating average rating:', error);
        next();
    }
});
//# sourceMappingURL=rating.model.js.map