"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rating_service_1 = tslib_1.__importDefault(require("../services/rating.service"));
const users_service_1 = tslib_1.__importDefault(require("../services/users.service"));
const matchPercentage_1 = require("../utils/matchPercentage");
const HttpException_1 = require("../exceptions/HttpException");
const job_service_1 = tslib_1.__importDefault(require("../services/job.service"));
const service_service_1 = tslib_1.__importDefault(require("../services/service.service"));
class RatingController {
    constructor() {
        this.ratingService = new rating_service_1.default();
        this.userService = new users_service_1.default();
        this.jobService = new job_service_1.default();
        this.serviceService = new service_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Rate Entity
        |--------------------------------------------------------------------------
        */
        this.rateEntity = async (req, res, next) => {
            try {
                const ratingData = req.body;
                const userId = req.params.id;
                if (userId == req.user.id)
                    throw new HttpException_1.HttpException(400, 8003, 'YOU_CANT_RATE_YOURSELF');
                const user = await this.userService.findUserById(userId);
                if (!user)
                    throw new HttpException_1.HttpException(400, 8003, 'USER_NOT_FOUND');
                const data = await this.ratingService.rateEntity(Object.assign(Object.assign({}, ratingData), { user_id: userId, reviewer: req.user.id, reviewer_location: req.user.country }));
                // Find all the ratings for the user
                const ratings = await this.ratingService.getRatingByUserId(userId);
                if (ratings) {
                    await this.userService.updateUser(userId, { rating: (0, matchPercentage_1.calculateAverageRating)(ratings) });
                }
                res.status(200).json({ status: 200, response_code: 8000, message: 'RATING_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Rating by ID
        |--------------------------------------------------------------------------
        */
        this.getRatingById = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.ratingService.getRatingById(id);
                res.status(200).json({ status: 200, response_code: 8000, message: 'RATING_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Rating by user ID
        |--------------------------------------------------------------------------
        */
        this.getRatingByUserId = async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await this.ratingService.getRatingByUserId(id);
                res.status(200).json({ status: 200, response_code: 8000, message: 'RATING_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get User Rating
        |--------------------------------------------------------------------------
        */
        this.getUserRating = async (req, res, next) => {
            try {
                const id = req.user.id;
                const data = await this.ratingService.getRatingByUserId(id);
                res.status(200).json({ status: 200, response_code: 8000, message: 'RATING_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Ratings
        |--------------------------------------------------------------------------
        */
        this.getAllRatings = async (req, res, next) => {
            try {
                const options = {
                    // sortBy: req.query.sortBy || 'date_posted:desc',
                    limit: parseInt(req.query.limit, 10) || 10,
                    page: parseInt(req.query.page, 10) || 1,
                    projectBy: req.query.projectBy || 'name:hide, role:hide',
                };
                const data = await this.ratingService.getAllRating(req.query, options);
                res.status(200).json({ status: 200, response_code: 8000, message: 'RATING_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | UnRate Entity
        |--------------------------------------------------------------------------
        */
        this.unRateEntity = async (req, res, next) => {
            try {
                const id = req.params.id;
                const body = req.body;
                const data = await this.ratingService.unRateEntity(id, Object.assign(Object.assign({}, body), { rating_value: -1 }));
                res.status(200).json({ status: 200, response_code: 8000, message: 'RATING_REQUEST_SUCCESSFUL', data });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = RatingController;
//# sourceMappingURL=rating.controller.js.map