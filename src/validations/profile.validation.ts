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
        name: Joi.string()
          .valid(...Object.values(JobTitle))
          .required(),
      }),
    )
    .required(),
  company_culture: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        name: Joi.string()
          .valid(...Object.values(TeamSize))
          .required(),
      }),
    )
    .required(),
  company_size: Joi.string()
    .valid(...Object.values(TeamSize))
    .required(),
  project_duration: Joi.string()
    .valid(...Object.values(JobDuration))
    .required(),
  team_size: Joi.string()
    .valid(...Object.values(TeamSize))
    .required(),
  work_location: Joi.string()
    .valid(...Object.values(WorkOption))
    .required(),
  work_timezone: Joi.string().required(),
  work_preference: Joi.string()
    .valid(...Object.values(WorkSchedule))
    .required(),
});

/*
|--------------------------------------------------------------------------
| Identity Validation
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
    line2: Joi.string().empty(),
    city: Joi.string().required(),
    state: Joi.string().required(),
  }).required(),
  social_links: Joi.object({
    personal_website: Joi.string().empty(),
    linkedin: Joi.string().empty(),
    stack_overflow: Joi.string().empty(),
    github: Joi.string().empty(),
    dribble: Joi.string().empty(),
    behance: Joi.string().empty(),
    glass_door: Joi.string().empty(),
  }),
  languages: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
    }),
  ),
});
