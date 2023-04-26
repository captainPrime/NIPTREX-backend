import Joi from 'joi';

export const biddingSchema = Joi.object({
  paymentType: Joi.string().valid('milestone', 'outright').required(),
  milestoneStage: Joi.when('paymentType', {
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
  coverLetter: Joi.string().required(),
  attachments: Joi.array().items(Joi.string()),
  links: Joi.array().items(Joi.string()),
  totalPriceOfProject: Joi.number().required(),
  serviceFee: Joi.number().required(),
  amountToBeReceived: Joi.number().required(),
  biddingAmount: Joi.number().required(),
});
