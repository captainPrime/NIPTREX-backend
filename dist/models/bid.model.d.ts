import { Schema, Document, Model } from 'mongoose';
interface BiddingStage {
    description?: string;
    status?: MilestoneStatus;
    dueDate?: Date;
    amount?: number;
    attachments?: string[];
    links?: string[];
}
export declare enum MilestoneStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    PAID = "paid"
}
export declare enum BiddingStatus {
    NULL = "null",
    PAID = "paid",
    CLOSED = "closed",
    APPLIED = "applied",
    COMPLETED = "completed",
    IN_PROGRESS = "in_progress"
}
export declare enum PaymentType {
    OUTRIGHT = "outright",
    MILESTONE = "milestone"
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
    outright_status: BiddingStatus;
}
export interface IUpdateBidding extends Partial<IBidding> {
    milestone_stage?: Partial<BiddingStage>[];
}
declare const BiddingModel: Model<IBidding>;
declare const ArchiveProposalModel: Model<any>;
declare const ShortListProposalModel: Model<any>;
export { BiddingStage, IBidding, BiddingModel, ArchiveProposalModel, ShortListProposalModel };
