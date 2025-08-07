"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingAddress = exports.Bio = exports.Preference = exports.Identity = exports.Billing = exports.Certification = exports.Education = exports.Experience = exports.About = void 0;
const profile_interface_1 = require("@/interfaces/profile.interface");
const toJSON_1 = require("@/modules/toJSON");
const mongoose_1 = require("mongoose");
const experienceSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    company: { type: String, requiredrequired: true },
    country: { type: String, required: true },
    role: { type: String, required: true },
    company_image_url: { type: String, trim: true },
    employment_type: {
        type: String,
        enum: Object.values(profile_interface_1.EmploymentType),
        required: true,
    },
    description: { type: String },
}, {
    timestamps: true,
});
const educationHistorySchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    id: { type: String, trim: true },
    institution: { type: String, trim: true },
    field_of_study: { type: String },
    degree_level: { type: String, trim: true },
    date_attended: { type: String, trim: true },
    graduation_date: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
const certificationSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, trim: true },
    organisation: { type: String, trim: true },
    description: { type: String, trim: true },
    certificate_url: { type: String, trim: true },
    company_image_url: { type: String, trim: true },
    date_obtained: {
        type: String,
        trim: true,
    },
});
const billingSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    per_annum: { type: Number, required: true },
    hourly_rate: { type: Number, required: true },
    payment_method: { type: String, enum: ['USD', 'NGN'], required: true },
    bank_name: { type: String, required: true },
    account_number: { type: Number, required: true },
    account_name: { type: String, required: true },
}, {
    timestamps: true,
});
const identitySchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    proof_of_identity: { type: String, required: true },
    proof_of_address: { type: String, required: true },
}, {
    timestamps: true,
});
const billingAddressSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    full_name: { type: String, required: true },
    company: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: false },
    country: { type: String, required: false },
    city: { type: String, required: false },
    postal_number: { type: Number, required: false },
}, {
    timestamps: true,
});
const workPreference = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    industry_type: [{ type: String }],
    project_duration: {
        type: String,
        required: true,
    },
    team_size: {
        type: String,
        required: true,
    },
    work_location: {
        type: String,
        required: true,
    },
    job_type: {
        type: String,
        enum: Object.values(profile_interface_1.WorkOption),
        required: true,
    },
}, {
    timestamps: true,
});
const aboutSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    token_activities: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Token' }],
    total_earnings: { type: Number, default: 0 },
    total_jobs: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    nips: { type: Number, default: 100 },
    personal_details: {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true },
        country: { type: String, required: true },
        profile_picture: { type: String, required: false, default: '' },
        dob: { type: String, required: true },
        role: { type: String, required: true },
        phone_number: { type: String, required: true },
        seniority: { type: String, required: true },
        gender: { type: String, required: true },
    },
    address: {
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
    },
    resume: [
        {
            name: { type: String },
            url: { type: String },
        },
    ],
    social_links: {
        personal_website: { type: String },
        linkedin: { type: String },
        stack_overflow: { type: String },
        github: { type: String },
        dribble: { type: String },
        behance: { type: String },
        glass_door: { type: String },
    },
    languages: [{ type: String }],
    skills: [{ type: String }],
    available_to_work: { type: Boolean, default: true },
}, {
    timestamps: true,
});
const bioSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    hourly_rate: { type: Number, required: true },
    description: { type: String, required: true },
}, {
    timestamps: true,
});
aboutSchema.plugin(toJSON_1.toJSON);
experienceSchema.plugin(toJSON_1.toJSON);
educationHistorySchema.plugin(toJSON_1.toJSON);
certificationSchema.plugin(toJSON_1.toJSON);
billingSchema.plugin(toJSON_1.toJSON);
identitySchema.plugin(toJSON_1.toJSON);
workPreference.plugin(toJSON_1.toJSON);
billingAddressSchema.plugin(toJSON_1.toJSON);
// Define a virtual for total_hours
aboutSchema.virtual('total_hours').get(function () {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const tokenActivities = this.token_activities.filter((activity) => activity.createdAt >= sevenDaysAgo && activity.createdAt <= now);
    let totalHours = 0;
    tokenActivities.forEach((activity) => {
        totalHours += activity.expires.getTime() - activity.createdAt.getTime();
    });
    return totalHours;
});
const About = (0, mongoose_1.model)('About', aboutSchema);
exports.About = About;
const Experience = (0, mongoose_1.model)('Experience', experienceSchema);
exports.Experience = Experience;
const Education = (0, mongoose_1.model)('Education', educationHistorySchema);
exports.Education = Education;
const Certification = (0, mongoose_1.model)('Certification', certificationSchema);
exports.Certification = Certification;
const Billing = (0, mongoose_1.model)('Billing', billingSchema);
exports.Billing = Billing;
const Identity = (0, mongoose_1.model)('Identity', identitySchema);
exports.Identity = Identity;
const Preference = (0, mongoose_1.model)('Preference', workPreference);
exports.Preference = Preference;
const Bio = (0, mongoose_1.model)('Bio', bioSchema);
exports.Bio = Bio;
const BillingAddress = (0, mongoose_1.model)('Bank', billingAddressSchema);
exports.BillingAddress = BillingAddress;
//# sourceMappingURL=profile.model.js.map