import Joi from 'joi';

// Define the validation schema for the hourly_rate range
const hourlyRateSchema = Joi.object({
  min: Joi.number().required(),
  max: Joi.number().required(),
});

const hourlyRateUpdateSchema = Joi.object({
  min: Joi.number().required(),
  max: Joi.number().required(),
});

// Define the validation schema for the JobSchema
export const jobSchemaValidation = Joi.object({
  user_id: Joi.string().required(),
  jobs_tags: Joi.array().items(Joi.string()).required(),
  job_title: Joi.string().required(),
  job_headline: Joi.string().required(),
  job_description: Joi.string().required(),
  attachments: Joi.array().items(Joi.string()),
  links: Joi.array().items(Joi.string()),
  project_duration: Joi.string(),
  hourly_rate: hourlyRateSchema, // Use the hourlyRateSchema for hourly_rate
  budget: Joi.number(),
  project_fixed: Joi.boolean().default(false),
  proposal_limit: Joi.number().default(50),
  proposal_left: Joi.number().default(50),
  experience_level: Joi.string(),
  activities: Joi.object({
    proposals: Joi.number().default(0),
    last_viewed: Joi.date(),
    interviewing: Joi.number().default(0),
    invites_sent: Joi.number().default(0),
    unanswered_invites: Joi.number().default(0),
  }),
  verified: Joi.boolean().required().default(true),
  rating: Joi.string().required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'COMPLETED').default('ACTIVE'),
  work_location: Joi.string().required(),
  job_type: Joi.string().valid('Remote', 'Hybrid', 'Onsite').required(),
  team_size: Joi.string().required(),
  industry_type: Joi.string().required(),
  project_type: Joi.string().required(),
  soft_skills: Joi.array().items(Joi.string()),
  languages: Joi.array().items(Joi.string()),
  date_posted: Joi.date().default(Date.now),
}).options({ allowUnknown: true, stripUnknown: true, abortEarly: false });

export const jobSchemaUpdateValidation = Joi.object({
  user_id: Joi.string(),
  jobs_tags: Joi.array().items(Joi.string()),
  job_title: Joi.string(),
  job_headline: Joi.string(),
  job_description: Joi.string(),
  attachments: Joi.array().items(Joi.string()),
  links: Joi.array().items(Joi.string()),
  project_duration: Joi.string(),
  hourly_rate: hourlyRateUpdateSchema, // Use the hourlyRateSchema for hourly_rate
  budget: Joi.number(),
  project_fixed: Joi.boolean().default(false),
  proposal_limit: Joi.number().default(50),
  proposal_left: Joi.number().default(50),
  experience_level: Joi.string(),
  activities: Joi.object({
    proposals: Joi.number().default(0),
    last_viewed: Joi.date(),
    interviewing: Joi.number().default(0),
    invites_sent: Joi.number().default(0),
    unanswered_invites: Joi.number().default(0),
  }),
  verified: Joi.boolean().default(true),
  rating: Joi.string(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'COMPLETED').default('ACTIVE'),
  work_location: Joi.string(),
  job_type: Joi.string().valid('Remote', 'Hybrid', 'Onsite'),
  team_size: Joi.string(),
  industry_type: Joi.string(),
  project_type: Joi.string(),
  soft_skills: Joi.array().items(Joi.string()),
  languages: Joi.array().items(Joi.string()),
  date_posted: Joi.date().default(Date.now),
}).min(1);
