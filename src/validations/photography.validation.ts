import Joi from 'joi';

/*
|--------------------------------------------------------------------------
| Photography Validation
|--------------------------------------------------------------------------
*/
export const photographySchemaValidation = Joi.object({
  image: Joi.object().optional(), // file from multer
  title: Joi.string().required(),
  price: Joi.string().required(),

  category: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string()), // e.g. ["Nature", "Portrait"]
      Joi.string(), // e.g. "Nature,Portrait"
    )
    .optional(),

  tags: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string()), // e.g. ["sunset", "hdr"]
      Joi.string(), // e.g. "sunset,hdr"
    )
    .optional(),

  licence: Joi.string().optional(), // e.g. "Royalty Free"

  listAsNFT: Joi.boolean().truthy('true').falsy('false').optional(), // "true"/"false" string from form-data
});

export const photographyUpdateValidation = Joi.object({
  cloudinary_id: Joi.string(),
  image: Joi.string(),
}).min(1);
