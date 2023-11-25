import Joi from 'joi';

/*
|--------------------------------------------------------------------------
| Config Validation
|--------------------------------------------------------------------------
*/
export const configSchemaValidation = Joi.object({
  key: Joi.object().required(),
  value: Joi.string().required(),
});

export const configUpdateValidation = Joi.object({
  key: Joi.string(),
  value: Joi.string(),
}).min(1);
