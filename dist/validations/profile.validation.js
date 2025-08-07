"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingAddressUpdateValidation = exports.billingAddressSchemaValidation = exports.updateResumeValidation = exports.updateAboutSchema = exports.aboutSchema = exports.workPreferenceUpdateSchema = exports.workPreferenceSchema = exports.bioSchemaUpdateValidation = exports.bioSchemaValidation = exports.identityUpdateSchema = exports.identitySchema = exports.billingUpdateSchema = exports.billingSchema = exports.certificationUpdateSchema = exports.certificationSchema = exports.educationHistoryUpdateSchema = exports.educationHistorySchema = exports.experienceValidation = void 0;
const tslib_1 = require("tslib");
const profile_interface_1 = require("@/interfaces/profile.interface");
const joi_1 = tslib_1.__importDefault(require("joi"));
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
/*
|--------------------------------------------------------------------------
| Experience Validation
|--------------------------------------------------------------------------
*/
exports.experienceValidation = joi_1.default.object({
    user_id: joi_1.default.string()
        .custom((value, helpers) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, 'MongoDB ObjectId')
        .required(),
    id: joi_1.default.string(),
    start_date: joi_1.default.date().required(),
    end_date: joi_1.default.date().greater(joi_1.default.ref('start_date')).required(),
    company: joi_1.default.string().required(),
    country: joi_1.default.string().required(),
    company_image_url: joi_1.default.string().optional(),
    role: joi_1.default.string().required(),
    employment_type: joi_1.default.string()
        .valid(...Object.values(profile_interface_1.EmploymentType))
        .required(),
    description: joi_1.default.string(),
});
/*
|--------------------------------------------------------------------------
| Education Validation
|--------------------------------------------------------------------------
*/
exports.educationHistorySchema = joi_1.default.object({
    user_id: joi_1.default.string().required(),
    institution: joi_1.default.string().required(),
    field_of_study: joi_1.default.string(),
    degree_level: joi_1.default.string().required(),
    date_attended: joi_1.default.string().required(),
    graduation_date: joi_1.default.string().required(),
});
exports.educationHistoryUpdateSchema = joi_1.default.object({
    user_id: joi_1.default.string(),
    id: joi_1.default.string(),
    institution: joi_1.default.string(),
    field_of_study: joi_1.default.string(),
    degree_level: joi_1.default.string(),
    date_attended: joi_1.default.string(),
    graduation_date: joi_1.default.string(),
}).min(1); // Specify minimum 1 field to be updated
/*
|--------------------------------------------------------------------------
| Certification Validation
|--------------------------------------------------------------------------
*/
exports.certificationSchema = joi_1.default.object({
    user_id: joi_1.default.string().required(),
    name: joi_1.default.string().optional(),
    organisation: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    certificate_url: joi_1.default.string().optional(),
    company_image_url: joi_1.default.string().optional(),
    date_obtained: joi_1.default.date().optional(),
});
exports.certificationUpdateSchema = joi_1.default.object({
    user_id: joi_1.default.string(),
    name: joi_1.default.string(),
    id: joi_1.default.string(),
    organisation: joi_1.default.string(),
    description: joi_1.default.string(),
    certificate_url: joi_1.default.string(),
    company_image_url: joi_1.default.string(),
    date_obtained: joi_1.default.date(),
}).min(1);
/*
|--------------------------------------------------------------------------
| Billing Validation
|--------------------------------------------------------------------------
*/
exports.billingSchema = joi_1.default.object({
    user_id: joi_1.default.string().required(),
    per_annum: joi_1.default.number().required(),
    hourly_rate: joi_1.default.number().required(),
    payment_method: joi_1.default.string()
        .valid(...Object.values(profile_interface_1.EPaymentMethod))
        .required(),
    bank_name: joi_1.default.string().required(),
    account_number: joi_1.default.number().required(),
    account_name: joi_1.default.string().required(),
});
exports.billingUpdateSchema = joi_1.default.object({
    user_id: joi_1.default.string(),
    per_annum: joi_1.default.number(),
    hourly_rate: joi_1.default.number(),
    payment_method: joi_1.default.string().valid(...Object.values(profile_interface_1.EPaymentMethod)),
    bank_name: joi_1.default.string(),
    account_number: joi_1.default.number(),
    account_name: joi_1.default.string(),
}).min(1);
/*
|--------------------------------------------------------------------------
| Identity Validation
|--------------------------------------------------------------------------
*/
exports.identitySchema = joi_1.default.object({
    user_id: joi_1.default.string().required(),
    proof_of_identity: joi_1.default.string().required(),
    proof_of_address: joi_1.default.string().required(),
});
exports.identityUpdateSchema = joi_1.default.object({
    user_id: joi_1.default.string(),
    proof_of_identity: joi_1.default.string(),
    proof_of_address: joi_1.default.string(),
}).min(1);
/*
|--------------------------------------------------------------------------
| Bio Validation
|--------------------------------------------------------------------------
*/
exports.bioSchemaValidation = joi_1.default.object({
    user_id: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    hourly_rate: joi_1.default.number().required(),
    description: joi_1.default.string().required(),
});
exports.bioSchemaUpdateValidation = joi_1.default.object({
    title: joi_1.default.string(),
    hourly_rate: joi_1.default.number(),
    description: joi_1.default.string(),
}).min(1);
/*
|--------------------------------------------------------------------------
| Identity Validation
|--------------------------------------------------------------------------
*/
exports.workPreferenceSchema = joi_1.default.object({
    user_id: joi_1.default.string().required(),
    industry_type: joi_1.default.array().items(joi_1.default.string()).required(),
    project_duration: joi_1.default.string().required(),
    team_size: joi_1.default.string().required(),
    work_location: joi_1.default.string().required(),
    job_type: joi_1.default.string()
        .valid(...Object.values(profile_interface_1.WorkOption))
        .required(),
});
exports.workPreferenceUpdateSchema = joi_1.default.object({
    user_id: joi_1.default.string(),
    industry_type: joi_1.default.array().items(joi_1.default.string()),
    project_duration: joi_1.default.string(),
    team_size: joi_1.default.string(),
    work_location: joi_1.default.string(),
    job_type: joi_1.default.string().valid(...Object.values(profile_interface_1.WorkOption)),
}).min(1);
/*
|--------------------------------------------------------------------------
| About Validation
|--------------------------------------------------------------------------
*/
exports.aboutSchema = joi_1.default.object({
    user_id: joi_1.default.string().required(),
    token_activities: joi_1.default.array().items(joi_1.default.string()),
    total_earnings: joi_1.default.number(),
    total_jobs: joi_1.default.number(),
    available: joi_1.default.number(),
    nips: joi_1.default.number(),
    personal_details: joi_1.default.object({
        first_name: joi_1.default.string().required(),
        last_name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        country: joi_1.default.string().required(),
        profile_picture: joi_1.default.string().optional(),
        dob: joi_1.default.string().required(),
        role: joi_1.default.string().required(),
        phone_number: joi_1.default.string().required(),
        seniority: joi_1.default.string().required(),
        gender: joi_1.default.string().required(),
    }).required(),
    address: joi_1.default.object({
        line1: joi_1.default.string().required(),
        line2: joi_1.default.string(),
        city: joi_1.default.string().required(),
        state: joi_1.default.string().required(),
    }).required(),
    resume: joi_1.default.array().items(joi_1.default.object({
        name: joi_1.default.string(),
        url: joi_1.default.string(),
    })),
    social_links: joi_1.default.object({
        personal_website: joi_1.default.string(),
        linkedin: joi_1.default.string(),
        stack_overflow: joi_1.default.string(),
        github: joi_1.default.string(),
        dribble: joi_1.default.string(),
        behance: joi_1.default.string(),
        glass_door: joi_1.default.string(),
    }),
    languages: joi_1.default.array().items(joi_1.default.string()),
    skills: joi_1.default.array().items(joi_1.default.string()),
    available_to_work: joi_1.default.boolean(),
});
exports.updateAboutSchema = joi_1.default.object({
    token_activities: joi_1.default.array().items(joi_1.default.string()),
    total_earnings: joi_1.default.number(),
    total_jobs: joi_1.default.number(),
    available: joi_1.default.number(),
    nips: joi_1.default.number(),
    personal_details: joi_1.default.object({
        first_name: joi_1.default.string(),
        last_name: joi_1.default.string(),
        email: joi_1.default.string().email(),
        country: joi_1.default.string(),
        profile_picture: joi_1.default.string(),
        dob: joi_1.default.string(),
        role: joi_1.default.string(),
        phone_number: joi_1.default.string(),
        seniority: joi_1.default.string(),
        gender: joi_1.default.string(),
    }),
    address: joi_1.default.object({
        line1: joi_1.default.string(),
        line2: joi_1.default.string(),
        city: joi_1.default.string(),
        state: joi_1.default.string(),
    }),
    resume: joi_1.default.array().items(joi_1.default.object({
        name: joi_1.default.string(),
        url: joi_1.default.string(),
    })),
    social_links: joi_1.default.object({
        personal_website: joi_1.default.string(),
        linkedin: joi_1.default.string(),
        stack_overflow: joi_1.default.string(),
        github: joi_1.default.string(),
        dribble: joi_1.default.string(),
        behance: joi_1.default.string(),
        glass_door: joi_1.default.string(),
    }),
    languages: joi_1.default.array().items(joi_1.default.string()),
    skills: joi_1.default.array().items(joi_1.default.string()),
    available_to_work: joi_1.default.boolean(),
}).min(1);
exports.updateResumeValidation = joi_1.default.object({
    name: joi_1.default.string(),
    url: joi_1.default.string(),
}).min(1);
/*
|--------------------------------------------------------------------------
| Bank Validation
|--------------------------------------------------------------------------
*/
exports.billingAddressSchemaValidation = joi_1.default.object({
    user_id: joi_1.default.string().required(),
    full_name: joi_1.default.string().required(),
    company: joi_1.default.string().required(),
    state: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    country: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    postal_number: joi_1.default.number().required(),
});
exports.billingAddressUpdateValidation = joi_1.default.object({
    full_name: joi_1.default.string(),
    company: joi_1.default.string(),
    state: joi_1.default.string(),
    address: joi_1.default.string(),
    country: joi_1.default.string(),
    city: joi_1.default.string(),
    postal_number: joi_1.default.number(),
}).min(1);
//# sourceMappingURL=profile.validation.js.map