import Joi from 'joi';

export const ratingValidationSchema = Joi.object({
  entity: Joi.string().required(),
  reviewer: Joi.string().required(),
  rating_value: Joi.number().required().min(0),
  comment: Joi.string().allow(''),
  entity_name: Joi.string().valid('User', 'Job', 'Service').required(),
});

export const ratingUpdateValidationSchema = Joi.object({
  rating_value: Joi.number().min(0),
  comment: Joi.string().allow('').optional(),
}).min(1);
