"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable security/detect-non-literal-regexp */
const bcryptjs_1 = require("bcryptjs");
const HttpException_1 = require("@exceptions/HttpException");
const users_model_1 = tslib_1.__importDefault(require("@models/users.model"));
const util_1 = require("@utils/util");
const profile_model_1 = require("@/models/profile.model");
const matchPercentage_1 = require("@/utils/matchPercentage");
class UserService {
    constructor() {
        this.users = users_model_1.default;
        this.about = profile_model_1.About;
    }
    async findAllUser() {
        const users = await this.users.find();
        return users;
    }
    async findAllFreelancer(query) {
        const users = await this.users.find({ user: 'freelancer' });
        const abouts = [];
        for (const user of users) {
            const about = await this.about.findOne({ user_id: user._id, skills: { $in: new RegExp(query.skills, 'i') } });
            if (about) {
                const payload = {
                    personal_details: about.personal_details,
                    address: about.address,
                    social_links: about.social_links,
                    languages: about.languages,
                    skills: about.skills,
                };
                abouts.push(payload);
            }
        }
        return abouts;
    }
    async findUserById(userId) {
        if ((0, util_1.isEmpty)(userId))
            throw new HttpException_1.HttpException(400, 2001, 'User id can not be empty');
        const findUser = await this.users.findOne({ _id: userId });
        return findUser;
    }
    async findUserByIds(userIds) {
        if ((0, util_1.isEmpty)(userIds))
            throw new HttpException_1.HttpException(400, 2001, 'User id can not be empty');
        const findUser = await this.users.find({ _id: { $in: userIds } });
        return findUser;
    }
    async findUserByEmail(email) {
        if ((0, util_1.isEmpty)(email))
            throw new HttpException_1.HttpException(400, 2003, 'Email should not be empty');
        const findUser = await this.users.findOne({ email });
        return findUser;
    }
    async findUserByReferralCode(referral_code) {
        if ((0, util_1.isEmpty)(referral_code))
            throw new HttpException_1.HttpException(400, 2003, 'Email should not be empty');
        const findUser = await this.users.findOne({ referral_code });
        return findUser;
    }
    async createUser(userData) {
        if ((0, util_1.isEmpty)(userData))
            throw new HttpException_1.HttpException(400, 2005, "You're not userData");
        const findUser = await this.users.findOne({ email: userData.email });
        if (findUser)
            throw new HttpException_1.HttpException(400, 2006, `You're email ${userData.email} already exists`);
        const hashedPassword = await (0, bcryptjs_1.hash)(userData.password, 10);
        const createUserData = (await this.users.create(Object.assign(Object.assign({}, userData), { password: hashedPassword, referral_code: (0, matchPercentage_1.generateReferralCode)(8) })));
        return createUserData;
    }
    async updateUser(userId, userData) {
        if ((0, util_1.isEmpty)(userData))
            throw new HttpException_1.HttpException(400, 2007, 'Fields cannot be empty');
        if (userData.email && (await users_model_1.default.isEmailTaken(userData.email, userId))) {
            throw new HttpException_1.HttpException(400, 2008, 'Email already taken');
        }
        if (userData.password) {
            const hashedPassword = await (0, bcryptjs_1.hash)(userData.password, 10);
            userData = Object.assign(Object.assign({}, userData), { password: hashedPassword });
        }
        const updateUserById = await this.users.findByIdAndUpdate(userId, userData, {
            new: true,
            runValidators: true,
        });
        if (!updateUserById)
            throw new HttpException_1.HttpException(400, 2009, "You're not user");
        return updateUserById;
    }
    async deleteUser(userId) {
        const deleteUserById = await this.users.findByIdAndDelete(userId);
        if (!deleteUserById)
            throw new HttpException_1.HttpException(400, 2010, "You're not user");
        return deleteUserById;
    }
}
exports.default = UserService;
//# sourceMappingURL=users.service.js.map