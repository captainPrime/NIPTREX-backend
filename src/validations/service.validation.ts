import Joi from 'joi';

export const serviceValidationSchema = Joi.object({
  image: Joi.array().items(Joi.string()).required(),
  name: Joi.string().required(),
  level: Joi.number().required(),
  location: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.string().required(),
});

export const serviceUpdateValidationSchema = Joi.object({
  image: Joi.array().items(Joi.string()),
  name: Joi.string(),
  level: Joi.number(),
  location: Joi.string(),
  description: Joi.string(),
  price: Joi.string(),
}).min(1);
