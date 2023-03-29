import { EmploymentType } from '@/interfaces/profile.interface';
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
