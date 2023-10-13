import Joi from 'joi';

/*
|--------------------------------------------------------------------------
| Photography Validation
|--------------------------------------------------------------------------
*/
export const photographySchemaValidation = Joi.object({
  user_id: Joi.string().required(),
  cloudinary_id: Joi.string().required(),
  image: Joi.string().required(),
});

export const photographyUpdateValidation = Joi.object({
  cloudinary_id: Joi.string(),
  image: Joi.string(),
}).min(1);
