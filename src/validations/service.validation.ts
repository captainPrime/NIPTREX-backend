import Joi from 'joi';

export const serviceValidationSchema = Joi.object({
  user_id: Joi.string().required(),
  title: Joi.string().required(),
  headline: Joi.string().required(),
  description: Joi.string().required(),
  projects: Joi.array().items(Joi.string()).required(),
  services: Joi.array().items(Joi.string()),
  price: Joi.object({
    basic: Joi.object({
      rate: Joi.string(),
      duration: Joi.string(),
      services: Joi.array().items(Joi.string()),
    }),
    standard: Joi.object({
      rate: Joi.string(),
      duration: Joi.string(),
      services: Joi.array().items(Joi.string()),
    }),
    premium: Joi.object({
      rate: Joi.string(),
      duration: Joi.string(),
      services: Joi.array().items(Joi.string()),
    }),
  }),
});

export const serviceUpdateValidationSchema = Joi.object({
  title: Joi.string(),
  headline: Joi.string(),
  description: Joi.string(),
  projects: Joi.array().items(Joi.string()),
  services: Joi.array().items(Joi.string()),
  price: Joi.object({
    basic: Joi.object({
      rate: Joi.string(),
      duration: Joi.string(),
      services: Joi.array().items(Joi.string()),
    }),
    standard: Joi.object({
      rate: Joi.string(),
      duration: Joi.string(),
      services: Joi.array().items(Joi.string()),
    }),
    premium: Joi.object({
      rate: Joi.string(),
      duration: Joi.string(),
      services: Joi.array().items(Joi.string()),
    }),
  }),
}).min(1);
