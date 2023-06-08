import Joi from 'joi';

// Message Validation Schema
export const chargeCardSchemaValidation = Joi.object({
  card_number: Joi.string().creditCard().required(),
  cvv: Joi.string().length(3).required(),
  expiry_month: Joi.string().length(2).required(),
  expiry_year: Joi.string().length(2).required(),
  currency: Joi.string().required(),
  amount: Joi.string().required(),
  redirect_url: Joi.string().uri().required(),
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().required(),
  tx_ref: Joi.string().required(),
});
