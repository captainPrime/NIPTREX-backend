"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const HttpException_1 = require("@exceptions/HttpException");
const util_1 = require("@utils/util");
const users_service_1 = tslib_1.__importDefault(require("./users.service"));
const photography_model_1 = require("@/models/photography.model");
class PhotographyService {
    constructor() {
        this.photography = photography_model_1.Photography;
        this.userService = new users_service_1.default();
    }
    /*
    |--------------------------------------------------------------------------
    | Create New Photography
    |--------------------------------------------------------------------------
    */
    async createPhotography(body) {
        if ((0, util_1.isEmpty)(body))
            throw new HttpException_1.HttpException(400, 9005, 'All required fields cannot be empty');
        const data = await this.photography.create(body);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get User Photography
    |--------------------------------------------------------------------------
    */
    async getUserPhotography(options, filter) {
        // if (isEmpty(userId)) throw new HttpException(400, 9001, 'User id can not be empty');
        const data = await this.photography.paginate(filter, options);
        if (!data)
            throw new HttpException_1.HttpException(400, 9003, 'PHOTOGRAPHY_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get All Photography
    |--------------------------------------------------------------------------
    */
    async getAllPhotography(filter, options) {
        const data = await this.photography.paginate(filter, options);
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Photography By Id
    |--------------------------------------------------------------------------
    */
    async getPhotographyById(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 9001, 'id can not be empty');
        const data = await this.photography.findOne({ _id: id }).populate({
            path: 'user_id',
            select: 'id first_name last_name email phone_number country createdAt',
            options: {
                lean: true, // return plain JS objects instead of Mongoose documents
            },
            as: 'user', // the name of the key to populate, defaults to the path
        });
        if (!data)
            throw new HttpException_1.HttpException(400, 9003, 'PHOTOGRAPHY_NOT_FOUND');
        return data;
    }
    /*
    |--------------------------------------------------------------------------
    | Update Bio By Id
    |--------------------------------------------------------------------------
    */
    //   public async updatePhotography(id: mongoose.Types.ObjectId | string, body: IUpdateBio): Promise<any> {
    //     if (isEmpty(id)) throw new HttpException(400, 9001, 'id can not be empty');
    //     const { error } = photographyUpdateValidation.validate(body);
    //     if (error) throw new HttpException(400, 9002, 'BILLING_ADDRESS_VALIDATION_ERROR', [error.details[0].message]);
    //     const data = await this.photography.findOne({ user_id: id });
    //     if (!data) throw new HttpException(400, 9003, 'BILLING_ADDRESS_NOT_FOUND');
    //     const updatedData = await this.photography.findByIdAndUpdate(data._id, body, {
    //       new: true,
    //     });
    //     if (!updatedData) throw new HttpException(400, 9009, 'BILLING_ADDRESS_REQUEST_ERROR');
    //     return updatedData;
    //   }
    /*
    |--------------------------------------------------------------------------
    | Delete Photography
    |--------------------------------------------------------------------------
    */
    async deletePhotography(id) {
        if ((0, util_1.isEmpty)(id))
            throw new HttpException_1.HttpException(400, 2001, 'id can not be empty');
        const data = await this.photography.findByIdAndDelete(id);
        if (!data)
            throw new HttpException_1.HttpException(400, 9009, 'PHOTOGRAPHY_REQUEST_ERROR');
        return data;
    }
}
exports.default = PhotographyService;
//# sourceMappingURL=photography.service.js.map