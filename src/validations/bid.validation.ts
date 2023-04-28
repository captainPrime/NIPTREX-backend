import Joi from 'joi';

export const biddingSchemaValidation = Joi.object({
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  payment_type: Joi.string().valid('milestone', 'outright').required(),
  milestone_stage: Joi.when('paymentType', {
    is: 'milestone',
    then: Joi.array()
      .items(
        Joi.object({
          description: Joi.string().required(),
          dueDate: Joi.date().required(),
          amount: Joi.number().required(),
        }),
      )
      .required(),
  }),
  cover_letter: Joi.string().required(),
  attachments: Joi.array().items(Joi.string()),
  links: Joi.array().items(Joi.string()),
  total_price_of_project: Joi.number().required(),
  service_fee: Joi.number().required(),
  amount_to_be_received: Joi.number().required(),
  bidding_amount: Joi.number().required(),
  date_applied: Joi.date().default(Date.now),
});
