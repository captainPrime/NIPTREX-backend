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

export const transactionValidationSchema = Joi.object({
  user_id: Joi.string().required(),
  proposal_id: Joi.string().required(),
  tx_ref: Joi.string().required(),
  flw_ref: Joi.string().required(),
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  status: Joi.string().required(),
  payment_type: Joi.string().valid('bank_transfer', 'card', 'account', 'ussd').required(),
  created_at: Joi.date().required(),
  customer_id: Joi.number().required(),
  customer_name: Joi.string().required(),
  customer_email: Joi.string().email().required(),
  nuban: Joi.string().when('payment_type', { is: 'bank_transfer', then: Joi.required().empty().allow('') }),
  bank: Joi.string().when('payment_type', { is: 'bank_transfer', then: Joi.required().empty().allow('') }),
  bank_name: Joi.string().when('payment_type', { is: 'bank_transfer', then: Joi.required().empty().allow('') }),
  card_first_6digits: Joi.string().when('payment_type', { is: 'card', then: Joi.required().empty().allow('') }),
  card_last_4digits: Joi.string().when('payment_type', { is: 'card', then: Joi.required().empty().allow('') }),
  card_issuer: Joi.string().when('payment_type', { is: 'card', then: Joi.required().empty().allow('') }),
  card_country: Joi.string().when('payment_type', { is: 'card', then: Joi.required().empty().allow('') }),
  card_type: Joi.string().when('payment_type', { is: 'card', then: Joi.required().empty().allow('') }),
  card_expiry: Joi.string().when('payment_type', { is: 'card', then: Joi.required().empty().allow('') }),
  timestamp: Joi.date().default(Date.now),
});
