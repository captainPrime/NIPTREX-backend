"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("@utils/util");
const HttpException_1 = require("@exceptions/HttpException");
const rating_model_1 = require("@/models/rating.model");
const rating_validation_1 = require("@/validations/rating.validation");
class RatingService {
    constructor() {
        this.rating = rating_model_1.RatingModel;
    }
    /*
    |--------------------------------------------------------------------------
    | Create Rating
    |--------------------------------------------------------------------------
    */
    async rateEntity(body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 8001, 'All required fields cannot be empty');
        const { error } = rating_validation_1.ratingValidationSchema.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 8001, 'RATING_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.rating.create(body);
        await data.save();
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get All Rating
    |--------------------------------------------------------------------------
    */
    async getAllRating(filter, options) {
        const data = await this.rating.paginate(filter, options);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Rating by ID
    |--------------------------------------------------------------------------
    */
    async getRatingById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 8001, 'ID cannot be empty');
        const data = await this.rating
            .findOne({ _id: id })
            .populate({
            path: 'user_id',
            select: 'first_name last_name profile_picture',
        })
            .populate({
            path: 'reviewer',
            select: 'first_name last_name profile_picture',
        });
        if (!data)
            throw new HttpException_1.HttpException(400, 8002, 'RATING_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Rating by ID
    |--------------------------------------------------------------------------
    */
    async getRatingByUserId(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 8001, 'ID cannot be empty');
        const data = await this.rating
            .find({ user_id: id })
            .populate({
            path: 'user_id',
            select: 'first_name last_name profile_picture',
        })
            .populate({
            path: 'reviewer',
            select: 'first_name last_name profile_picture',
        });
        if (!data)
            throw new HttpException_1.HttpException(400, 8002, 'RATING_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | un Rating by ID
    |--------------------------------------------------------------------------
    */
    async unRateEntity(id, body) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'ID cannot be empty');
        const { error } = rating_validation_1.ratingUpdateValidationSchema.validate(body);
        if (error)
            throw new HttpException_1.HttpException(400, 2002, 'SERVICE_VALIDATION_ERROR', [error.details[0].message]);
        const data = await this.rating.findByIdAndDelete(id);
        if (!data)
            throw new HttpException_1.HttpException(400, 2009, 'RATING_REQUEST_ERROR');
        const updatedData = await this.rating.findByIdAndUpdate(id, body, {
            new: true,
        });
        if (!updatedData)
            throw new HttpException_1.HttpException(400, 2009, 'RATING_REQUEST_ERROR');
        return updatedData;
    }
}
exports.default = RatingService;
//# sourceMappingURL=rating.service.js.map