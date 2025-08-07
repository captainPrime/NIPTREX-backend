"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const toJSON_1 = require("../modules/toJSON");
const paginate_1 = require("../modules/paginate");
const userSchema = new mongoose_1.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phone_number: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    user: {
        type: String,
        enum: ['admin', 'freelancer', 'client'],
        default: 'freelancer',
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: false,
        default: 0,
    },
    referral_code: {
        type: String,
        required: false,
    },
    profile_picture: {
        type: String,
        required: false,
        default: '',
    },
    verified: {
        type: Boolean,
        default: false,
    },
    has_profile: {
        type: Boolean,
        default: false,
    },
    has_about: {
        type: Boolean,
        default: false,
    },
    has_experience: {
        type: Boolean,
        default: false,
    },
    has_education: {
        type: Boolean,
        default: false,
    },
    has_certification: {
        type: Boolean,
        default: false,
    },
    has_billing: {
        type: Boolean,
        default: false,
    },
    has_identity: {
        type: Boolean,
        default: false,
    },
    has_work_preference: {
        type: Boolean,
        default: false,
    },
    is_profile_completed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
userSchema.plugin(toJSON_1.toJSON);
userSchema.plugin(paginate_1.paginate);
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isEmailTaken', async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
});
/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method('isPasswordMatch', async function (password) {
    const user = this;
    return bcryptjs_1.default.compare(password, user.password);
});
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcryptjs_1.default.hash(user.password, 8);
    }
    next();
});
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('has_education')) {
        user.is_profile_completed = true;
    }
    next();
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
//# sourceMappingURL=users.model.js.map