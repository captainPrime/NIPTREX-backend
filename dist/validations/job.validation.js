"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobSchemaUpdateValidation = exports.jobSchemaValidation = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
// Define the validation schema for the hourly_rate range
const hourlyRateSchema = joi_1.default.object({
    min: joi_1.default.number().required(),
    max: joi_1.default.number().required(),
});
const hourlyRateUpdateSchema = joi_1.default.object({
    min: joi_1.default.number().required(),
    max: joi_1.default.number().required(),
});
// Define the validation schema for the JobSchema
exports.jobSchemaValidation = joi_1.default.object({
    user_id: joi_1.default.string().required(),
    freelancer_id: joi_1.default.string().optional(),
    jobs_tags: joi_1.default.array().items(joi_1.default.string()).required(),
    job_title: joi_1.default.string().required(),
    job_headline: joi_1.default.string().required(),
    job_description: joi_1.default.string().required(),
    attachments: joi_1.default.array().items(joi_1.default.string()),
    links: joi_1.default.array().items(joi_1.default.string()),
    project_duration: joi_1.default.string(),
    hourly_rate: hourlyRateSchema,
    budget: joi_1.default.number(),
    project_fixed: joi_1.default.boolean().default(false),
    proposal_limit: joi_1.default.number().default(50),
    proposal_left: joi_1.default.number().default(50),
    experience_level: joi_1.default.string(),
    featured: joi_1.default.boolean().optional(),
    activities: joi_1.default.object({
        proposals: joi_1.default.number().default(0),
        last_viewed: joi_1.default.date(),
        interviewing: joi_1.default.number().default(0),
        invites_sent: joi_1.default.number().default(0),
        unanswered_invites: joi_1.default.number().default(0),
    }),
    verified: joi_1.default.boolean().required().default(true),
    rating: joi_1.default.string().optional(),
    status: joi_1.default.string().valid('active', 'inactive', 'taken', 'pending').default('active'),
    work_location: joi_1.default.string().required(),
    job_type: joi_1.default.string().valid('Remote', 'Hybrid', 'Onsite', 'Freelance').required(),
    team_size: joi_1.default.string().required(),
    industry_type: joi_1.default.string().required(),
    nips: joi_1.default.number().default(5),
    project_type: joi_1.default.string().required(),
    soft_skills: joi_1.default.array().items(joi_1.default.string()),
    languages: joi_1.default.array().items(joi_1.default.string()),
    date_posted: joi_1.default.date().default(Date.now),
}).options({ allowUnknown: true, stripUnknown: true, abortEarly: false });
exports.jobSchemaUpdateValidation = joi_1.default.object({
    user_id: joi_1.default.string(),
    freelancer_id: joi_1.default.string(),
    jobs_tags: joi_1.default.array().items(joi_1.default.string()),
    job_title: joi_1.default.string(),
    job_headline: joi_1.default.string(),
    job_description: joi_1.default.string(),
    attachments: joi_1.default.array().items(joi_1.default.string()),
    links: joi_1.default.array().items(joi_1.default.string()),
    project_duration: joi_1.default.string(),
    hourly_rate: hourlyRateUpdateSchema,
    budget: joi_1.default.number(),
    project_fixed: joi_1.default.boolean().default(false),
    proposal_limit: joi_1.default.number().default(50),
    proposal_left: joi_1.default.number().default(50),
    experience_level: joi_1.default.string(),
    activities: joi_1.default.object({
        proposals: joi_1.default.number().default(0),
        last_viewed: joi_1.default.date(),
        interviewing: joi_1.default.number().default(0),
        invites_sent: joi_1.default.number().default(0),
        unanswered_invites: joi_1.default.number().default(0),
    }),
    verified: joi_1.default.boolean().default(true),
    rating: joi_1.default.number(),
    status: joi_1.default.string().valid('active', 'inactive', 'taken', 'pending').default('active'),
    work_location: joi_1.default.string(),
    job_type: joi_1.default.string().valid('Remote', 'Hybrid', 'Onsite'),
    team_size: joi_1.default.string(),
    industry_type: joi_1.default.string(),
    nips: joi_1.default.number(),
    project_type: joi_1.default.string(),
    soft_skills: joi_1.default.array().items(joi_1.default.string()),
    languages: joi_1.default.array().items(joi_1.default.string()),
    date_posted: joi_1.default.date().default(Date.now),
    featured: joi_1.default.boolean().optional(),
}).min(1);
//# sourceMappingURL=job.validation.js.map