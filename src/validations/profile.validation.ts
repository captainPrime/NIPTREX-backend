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
        type: Joi.string()
          .valid(...Object.values(JobTitle))
          .required(),
      }),
    )
    .required(),
  company_culture: Joi.array()
    .items(
      Joi.object({
        type: Joi.string()
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
