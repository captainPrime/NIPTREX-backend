import Joi from 'joi';

// Chat Validation Schema
export const chatSchemaValidation = Joi.object({
  user1: Joi.string().required().label('User 1'),
  user2: Joi.string().required().label('User 2'),
  milestone: Joi.string().required(),
});

// Message Validation Schema
export const messageSchemaValidation = Joi.object({
  sender: Joi.string().required(),
  milestone: Joi.string().required(),
  content: Joi.string().when('is_file', {
    is: false,
    then: Joi.string().required(),
    otherwise: Joi.string().allow('').optional(),
  }),
  is_file: Joi.boolean().optional().default(false),
  files: Joi.array()
    .items(Joi.string())
    .when('is_file', {
      is: true,
      then: Joi.array().items(Joi.string().required().min(1)),
      otherwise: Joi.array().items(Joi.string().allow('').optional()),
    }),
  createdAt: Joi.date().default(Date.now),
}).custom((value, helpers) => {
  const { content, files } = value;

  if (content && files && files.length > 0) {
    return helpers.error('any.invalid', {
      message: 'Sending both content and files together is not allowed',
    });
  }

  return value;
});
