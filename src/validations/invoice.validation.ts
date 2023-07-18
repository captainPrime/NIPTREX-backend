import Joi from 'joi';

export const invoiceSchema = Joi.object({
  title: Joi.string().required(),
  package: Joi.array().items(Joi.string().required()).required(),
  promo_code: Joi.string().optional(),
  total: Joi.number().required(),
  service_fee: Joi.number().required(),
  VAT: Joi.number().required(),
});
