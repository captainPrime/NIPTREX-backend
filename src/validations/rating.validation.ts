import Joi from 'joi';

export const ratingValidationSchema = Joi.object({
  user_id: Joi.string().required(),
  reviewer: Joi.string().required(),
  rating_value: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().required(),
});

export const ratingUpdateValidationSchema = Joi.object({
  rating_value: Joi.number().min(0),
  comment: Joi.string().allow('').optional(),
}).min(1);
