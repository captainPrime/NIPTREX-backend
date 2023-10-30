import Joi from 'joi';

/*
|--------------------------------------------------------------------------
| Photography Validation
|--------------------------------------------------------------------------
*/
export const photographySchemaValidation = Joi.object({
  image: Joi.string().required(),
  title: Joi.string().required(),
  price: Joi.string().required(),
});

export const photographyUpdateValidation = Joi.object({
  cloudinary_id: Joi.string(),
  image: Joi.string(),
}).min(1);
