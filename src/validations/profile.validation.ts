import { EmploymentType, JobDuration, JobTitle, TeamSize, WorkOption, WorkSchedule } from '@/interfaces/profile.interface';
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
  id: Joi.string().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().greater(Joi.ref('start_date')).required(),
  company: Joi.string().required(),
  country: Joi.string().required(),
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
  id: Joi.string().required(),
  institution: Joi.string().required(),
  field_of_study: Joi.string(),
  degree_level: Joi.string().required(),
  date_attended: Joi.string().required(),
  employment_type: Joi.string()
    .valid(...Object.values(EmploymentType))
    .required(),
});

/*
|--------------------------------------------------------------------------
| Certification Validation
|--------------------------------------------------------------------------
*/
export const certificationSchema = Joi.object({
  user_id: Joi.string().required(),
  id: Joi.string().optional(),
  name: Joi.string().optional(),
  organisation: Joi.string().optional(),
  certificate_url: Joi.string().optional(),
  date_obtained: Joi.date().optional(),
});

/*
|--------------------------------------------------------------------------
| Billing Validation
|--------------------------------------------------------------------------
*/
export const billingSchema = Joi.object({
  user_id: Joi.string().required(),
  per_annum: Joi.string().required(),
  hourly_rate: Joi.string().required(),
  payment_method: Joi.string().required(),
});

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

/*
|--------------------------------------------------------------------------
| Identity Validation
|--------------------------------------------------------------------------
*/
export const workPreferenceSchema = Joi.object({
  user_id: Joi.string().required(),
  industry_type: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
      }),
    )
    .required(),
  company_culture: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
      }),
    )
    .required(),
  company_size: Joi.string().required(),
  project_duration: Joi.string().required(),
  team_size: Joi.string().required(),
  work_location: Joi.string().required(),
  work_timezone: Joi.string().required(),
  work_preference: Joi.string().required(),
});

/*
|--------------------------------------------------------------------------
| About Validation
|--------------------------------------------------------------------------
*/
export const aboutSchema = Joi.object({
  user_id: Joi.string().required(),
  personal_details: Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    country: Joi.string().required(),
    profile_picture: Joi.string().required(),
    dob: Joi.string().required(),
    role: Joi.string().required(),
    phone_number: Joi.string().required(),
    seniority: Joi.string().required(),
    gender: Joi.string().required(),
    resume: Joi.string(),
  }).required(),
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
  languages: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
    }),
  ),
});
