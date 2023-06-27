import Joi from 'joi';

export const ratingValidationSchema = Joi.object({
  entity_type: Joi.string().required(),
  entity_id: Joi.string().required(),
  rating_value: Joi.number().required().min(0),
  comment: Joi.string().allow('').optional(),
});

export const ratingUpdateValidationSchema = Joi.object({
  rating_value: Joi.number().min(0),
  comment: Joi.string().allow('').optional(),
}).min(1);
