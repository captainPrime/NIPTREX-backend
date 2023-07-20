import Joi from 'joi';

export const invoiceSchema = Joi.object({
  title: Joi.string(),
  package: Joi.array().items(Joi.string().required()),
  promo_code: Joi.string().optional(),
  total: Joi.number().optional(),
  service_fee: Joi.number().optional(),
  vat: Joi.number().optional(),
});

export const invoiceUpdateSchema = Joi.object({
  title: Joi.string(),
  package: Joi.array().items(Joi.string().required()),
  promo_code: Joi.string().optional(),
  total: Joi.number(),
  service_fee: Joi.number(),
  vat: Joi.number(),
});
