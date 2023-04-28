import { Schema, Document, Model, model } from 'mongoose';

interface BiddingStage {
  description: string;
  dueDate: Date;
  amount: number;
}

interface IBidding extends Document {
  payment_type: 'milestone' | 'outright';
  milestone_stage?: BiddingStage[];
  cover_letter: string;
  attachments?: string[];
  links?: string[];
  total_price_of_project: number;
  service_fee: number;
  amount_to_be_received: number;
  bidding_amount: number;
}

const BiddingSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  job_id: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  payment_type: {
    type: String,
    required: true,
    enum: ['milestone', 'outright'],
  },
  milestone_stage: {
    type: [
      {
        description: {
          type: String,
          required: true,
        },
        dueDate: {
          type: Date,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    required: function (this: IBidding) {
      return this.payment_type === 'milestone';
    },
  },
  cover_letter: {
    type: String,
    required: true,
  },
  attachments: {
    type: [String],
  },
  links: {
    type: [String],
  },
  total_price_of_project: {
    type: Number,
    required: true,
  },
  service_fee: {
    type: Number,
    required: true,
  },
  amount_to_be_received: {
    type: Number,
    required: true,
  },
  bidding_amount: {
    type: Number,
    required: true,
  },
  date_applied: {
    type: Date,
    default: Date.now,
  },
});

const BiddingModel: Model<IBidding> = model<IBidding>('Bidding', BiddingSchema);

export { BiddingStage, IBidding, BiddingModel };
