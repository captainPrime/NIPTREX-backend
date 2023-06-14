import Joi from 'joi';

export const serviceValidationSchema = Joi.object({
  image: Joi.array().items(Joi.string()).required(),
  name: Joi.string().required(),
  level: Joi.number().required(),
  location: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.string().required(),
});
