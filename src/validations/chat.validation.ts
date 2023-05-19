import Joi from 'joi';

// Chat Validation Schema
export const chatSchemaValidation = Joi.object({
  user1: Joi.string().required().label('User 1'),
  user2: Joi.string().required().label('User 2'),
});

// Message Validation Schema
export const messageSchemaValidation = Joi.object({
  chat: Joi.string().required(),
  sender: Joi.string().required().label('Sender'),
  receiver: Joi.string().required().label('Receiver'),
  content: Joi.string().required().label('Content'),
});
