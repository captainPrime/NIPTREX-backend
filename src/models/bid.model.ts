import { paginate } from '@/modules/paginate';
import { Schema, Document, Model, model } from 'mongoose';

interface BiddingStage {
  description?: string;
  status?: MilestoneStatus;
  dueDate?: Date;
  amount?: number;
  attachments?: string[];
  links?: string[];
}

enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  PAID = 'paid',
}

enum BiddingStatus {
  CLOSED = 'closed',
  IN_PROGRESS = 'in_progress',
  PAID = 'paid',
  APPLIED = 'applied',
  COMPLETED = 'completed',
}

enum PaymentType {
  MILESTONE = 'milestone',
  OUTRIGHT = 'outright',
}

interface IBidding extends Document {
  user_id: Schema.Types.ObjectId;
  job_id: Schema.Types.ObjectId;
  payment_type: PaymentType;
  milestone_stage?: BiddingStage[];
  cover_letter: string;
  attachments?: string[];
  links?: string[];
  total_price_of_project: number;
  service_fee: number;
  amount_to_be_received: number;
  bidding_amount: number;
  status: BiddingStatus;
  date_applied: Date;
  liked: boolean;
  disliked: boolean;
}

export interface IUpdateBidding extends Partial<IBidding> {
  milestone_stage?: Partial<BiddingStage>[];
}

const BiddingSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  job_id: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  payment_type: {
    type: String,
    required: true,
    enum: Object.values(PaymentType),
  },
  milestone_stage: {
    type: [
      {
        description: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          required: true,
          enum: Object.values(MilestoneStatus),
          default: MilestoneStatus.PENDING,
        },
        dueDate: {
          type: Date,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        attachments: {
          type: [String],
        },
        links: {
          type: [String],
        },
      },
    ],
    required: function (this: IBidding) {
      return this.payment_type === PaymentType.MILESTONE;
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
  status: {
    type: String,
    enum: Object.values(BiddingStatus),
    default: BiddingStatus.APPLIED,
  },
  date_applied: {
    type: Date,
    default: Date.now,
  },
  liked: {
    type: Boolean,
    default: false,
  },
  disliked: {
    type: Boolean,
    default: false,
  },
});

const ArchiveProposalSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    client_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    proposal: { type: Schema.Types.ObjectId, ref: 'Bidding', required: true },
  },
  {
    timestamps: true,
  },
);

const ShortListProposalSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    client_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    proposal: { type: Schema.Types.ObjectId, ref: 'Bidding', required: true },
  },
  {
    timestamps: true,
  },
);

BiddingSchema.plugin(paginate);
ArchiveProposalSchema.plugin(paginate);
ShortListProposalSchema.plugin(paginate);

const BiddingModel: Model<IBidding> = model<IBidding>('Bidding', BiddingSchema);
const ArchiveProposalModel: Model<any> = model<any>('ArchiveProposal', ArchiveProposalSchema);
const ShortListProposalModel: Model<any> = model<any>('ShortListProposal', ShortListProposalSchema);

export { BiddingStage, IBidding, BiddingModel, ArchiveProposalModel, ShortListProposalModel };
