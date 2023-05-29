import { BiddingStatus, MilestoneStatus, PaymentType } from '@/models/bid.model';
import Joi from 'joi';

export const biddingSchemaValidation = Joi.object({
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  payment_type: Joi.string()
    .valid(...Object.values(PaymentType))
    .required(),
  milestone_stage: Joi.when('paymentType', {
    is: PaymentType.MILESTONE,
    then: Joi.array()
      .items(
        Joi.object({
          description: Joi.string().required(),
          dueDate: Joi.date().required(),
          status: Joi.string()
            .required()
            .valid(...Object.values(MilestoneStatus))
            .default(MilestoneStatus.PENDING),
          amount: Joi.number().required(),
          attachments: Joi.array().items(Joi.string()),
          links: Joi.array().items(Joi.string()),
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
  status: Joi.string()
    .valid(...Object.values(BiddingStatus))
    .default(BiddingStatus.APPLIED),
  date_applied: Joi.date().default(Date.now),
  liked: Joi.boolean().default(false),
  disliked: Joi.boolean().default(false),
});

export const updateBiddingSchemaValidation = Joi.object({
  user_id: Joi.string(),
  job_id: Joi.string(),
  payment_type: Joi.string().valid(...Object.values(PaymentType)),
  milestone_stage: Joi.when('paymentType', {
    is: PaymentType.MILESTONE,
    then: Joi.array().items(
      Joi.object({
        description: Joi.string(),
        dueDate: Joi.date(),
        status: Joi.string()
          .valid(...Object.values(MilestoneStatus))
          .default(MilestoneStatus.PENDING),
        amount: Joi.number(),
        attachments: Joi.array().items(Joi.string()),
        links: Joi.array().items(Joi.string()),
      }),
    ),
  }),
  cover_letter: Joi.string(),
  attachments: Joi.array().items(Joi.string()),
  links: Joi.array().items(Joi.string()),
  total_price_of_project: Joi.number(),
  service_fee: Joi.number(),
  amount_to_be_received: Joi.number(),
  bidding_amount: Joi.number(),
  status: Joi.string()
    .valid(...Object.values(BiddingStatus))
    .default(BiddingStatus.APPLIED),
  date_applied: Joi.date().default(Date.now),
  liked: Joi.boolean().default(false),
  disliked: Joi.boolean().default(false),
}).min(1);
