import { EPaymentMethod, EmploymentType, WorkOption } from '@/interfaces/profile.interface';
import Joi from 'joi';
import mongoose from 'mongoose';

/*
|--------------------------------------------------------------------------
| Experience Validation
|--------------------------------------------------------------------------
*/
export const experienceValidation = Joi.object({
  user_id: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'MongoDB ObjectId')
    .required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().greater(Joi.ref('start_date')).required(),
  company: Joi.string().required(),
  country: Joi.string().required(),
  company_image_url: Joi.string().optional(),
  role: Joi.string().required(),
  employment_type: Joi.string()
    .valid(...Object.values(EmploymentType))
    .required(),
  description: Joi.string(),
});

/*
|--------------------------------------------------------------------------
| Education Validation
|--------------------------------------------------------------------------
*/
export const educationHistorySchema = Joi.object({
  user_id: Joi.string().required(),
  institution: Joi.string().required(),
  field_of_study: Joi.string(),
  degree_level: Joi.string().required(),
  date_attended: Joi.string().required(),
  graduation_date: Joi.string().required(),
});

export const educationHistoryUpdateSchema = Joi.object({
  user_id: Joi.string(),
  institution: Joi.string(),
  field_of_study: Joi.string(),
  degree_level: Joi.string(),
  date_attended: Joi.string(),
  graduation_date: Joi.string(),
}).min(1); // Specify minimum 1 field to be updated

/*
|--------------------------------------------------------------------------
| Certification Validation
|--------------------------------------------------------------------------
*/
export const certificationSchema = Joi.object({
  user_id: Joi.string().required(),
  name: Joi.string().optional(),
  organisation: Joi.string().optional(),
  description: Joi.string().optional(),
  certificate_url: Joi.string().optional(),
  company_image_url: Joi.string().optional(),
  date_obtained: Joi.date().optional(),
});

export const certificationUpdateSchema = Joi.object({
  user_id: Joi.string(),
  name: Joi.string(),
  organisation: Joi.string(),
  certificate_url: Joi.string(),
  company_image_url: Joi.string(),
  date_obtained: Joi.date(),
}).min(1);

/*
|--------------------------------------------------------------------------
| Billing Validation
|--------------------------------------------------------------------------
*/
export const billingSchema = Joi.object({
  user_id: Joi.string().required(),
  per_annum: Joi.number().required(),
  hourly_rate: Joi.number().required(),
  payment_method: Joi.string()
    .valid(...Object.values(EPaymentMethod))
    .required(),
});

export const billingUpdateSchema = Joi.object({
  user_id: Joi.string(),
  per_annum: Joi.number(),
  hourly_rate: Joi.number(),
  payment_method: Joi.string().valid(...Object.values(EPaymentMethod)),
}).min(1);

/*
|--------------------------------------------------------------------------
| Identity Validation
|--------------------------------------------------------------------------
*/
export const identitySchema = Joi.object({
  user_id: Joi.string().required(),
  proof_of_identity: Joi.string().required(),
  proof_of_address: Joi.string().required(),
});

export const identityUpdateSchema = Joi.object({
  user_id: Joi.string(),
  proof_of_identity: Joi.string(),
  proof_of_address: Joi.string(),
}).min(1);

/*
|--------------------------------------------------------------------------
| Bio Validation
|--------------------------------------------------------------------------
*/
export const bioSchemaValidation = Joi.object({
  user_id: Joi.string().required(),
  title: Joi.string().required(),
  hourly_rate: Joi.number().required(),
  description: Joi.string().required(),
});

export const bioSchemaUpdateValidation = Joi.object({
  title: Joi.string(),
  hourly_rate: Joi.number(),
  description: Joi.string(),
}).min(1);

/*
|--------------------------------------------------------------------------
| Identity Validation
|--------------------------------------------------------------------------
*/
export const workPreferenceSchema = Joi.object({
  user_id: Joi.string().required(),
  industry_type: Joi.array().items(Joi.string()).required(),
  project_duration: Joi.string().required(),
  team_size: Joi.string().required(),
  work_location: Joi.string().required(),
  job_type: Joi.string()
    .valid(...Object.values(WorkOption))
    .required(),
});

export const workPreferenceUpdateSchema = Joi.object({
  user_id: Joi.string(),
  industry_type: Joi.array().items(Joi.string()),
  project_duration: Joi.string(),
  team_size: Joi.string(),
  work_location: Joi.string(),
  job_type: Joi.string().valid(...Object.values(WorkOption)),
}).min(1);

/*
|--------------------------------------------------------------------------
| About Validation
|--------------------------------------------------------------------------
*/
export const aboutSchema = Joi.object({
  user_id: Joi.string().required(),
  personal_details: Joi.object({
    profile_picture: Joi.string().required(),
    dob: Joi.string().required(),
    role: Joi.string().required(),
    seniority: Joi.string().required(),
    phone_number: Joi.string().required(),
    gender: Joi.string().required(),
    resume: Joi.array().items(Joi.string()),
  })
    .unknown(true)
    .required(),
  address: Joi.object({
    line1: Joi.string().required(),
    line2: Joi.string().optional().allow(''),
    city: Joi.string().required(),
    state: Joi.string().required(),
  }).required(),
  social_links: Joi.object({
    personal_website: Joi.string().optional().allow(''),
    linkedin: Joi.string().optional().allow(''),
    stack_overflow: Joi.string().optional().allow(''),
    github: Joi.string().optional().allow(''),
    dribble: Joi.string().optional().allow(''),
    behance: Joi.string().optional().allow(''),
    glass_door: Joi.string().optional().allow(''),
  }),
  languages: Joi.array().items(Joi.string()),
  skills: Joi.array().items(Joi.string()),
});

export const updateAboutSchema = Joi.object({
  user_id: Joi.string(),
  personal_details: Joi.object({
    profile_picture: Joi.string(),
    dob: Joi.string(),
    role: Joi.string(),
    seniority: Joi.string(),
    phone_number: Joi.string(),
    gender: Joi.string(),
    resume: Joi.array().items(Joi.string()),
  }).unknown(true),
  address: Joi.object({
    line1: Joi.string(),
    line2: Joi.string().allow(''),
    city: Joi.string(),
    state: Joi.string(),
  }),
  social_links: Joi.object({
    personal_website: Joi.string().allow(''),
    linkedin: Joi.string().allow(''),
    stack_overflow: Joi.string().allow(''),
    github: Joi.string().allow(''),
    dribble: Joi.string().allow(''),
    behance: Joi.string().allow(''),
    glass_door: Joi.string().allow(''),
  }),
  languages: Joi.array().items(Joi.string()),
  skills: Joi.array().items(Joi.string()),
}).min(1);
