import Joi from 'joi';

// Chat Validation Schema
export const chatSchemaValidation = Joi.object({
  participants: Joi.array().items(Joi.string()).required(),
  milestone: Joi.string().required(),
});

// Message Validation Schema
export const messageSchemaValidation = Joi.object({
  sender: Joi.string().required(),
  chatId: Joi.string().required(),
  content: Joi.string().when('is_file', {
    is: false,
    then: Joi.string().optional(),
    otherwise: Joi.string().allow('').optional(),
  }),
  is_file: Joi.boolean().optional().default(false),
  files: Joi.when('is_file', {
    is: true,
    then: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().optional(),
          url: Joi.string().optional(),
        }),
      )
      .min(1)
      .optional(),
    otherwise: Joi.array().max(0).optional(),
  }),
  createdAt: Joi.date().default(Date.now),
});
