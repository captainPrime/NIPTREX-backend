import { IJob, JobStatus } from '@/interfaces/job.inteface';
import { WorkOption } from '@/interfaces/profile.interface';
import { toJSON } from '@/modules/toJSON';
import { paginate } from '@/modules/paginate';
import { Query, Schema, UpdateQuery, model } from 'mongoose';

const JobSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    freelancer_id: { type: Schema.Types.ObjectId, ref: 'User' },
    jobs_tags: [{ type: String, required: true }],
    job_title: { type: String, required: true },
    job_headline: { type: String, required: true },
    job_description: { type: String, required: true },
    attachments: [{ type: String }],
    links: [{ type: String }],
    project_duration: { type: String },
    hourly_rate: {
      min: { type: Number }, // Minimum hourly rate
      max: { type: Number }, // Maximum hourly rate
    },
    budget: { type: Number },
    project_fixed: { type: Boolean, default: false },
    proposal_limit: { type: Number, default: 50 },
    proposal_left: { type: Number, default: 50 },
    experience_level: { type: String },
    activities: {
      proposals: { type: Number, default: 0 },
      last_viewed: { type: Date },
      interviewing: { type: Number, default: 0 },
      invites_sent: { type: Number, default: 0 },
      unanswered_invites: { type: Number, default: 0 },
    },
    verified: { type: Boolean, required: true, default: true },
    rating: { type: String, required: true },
    status: { type: String, enum: Object.values(JobStatus), default: JobStatus.ACTIVE },
    work_location: { type: String, required: true },
    job_type: { type: String, enum: Object.values(WorkOption), required: true },
    team_size: { type: String, required: true },
    industry_type: { type: String, required: true },
    nips: { type: Number, default: 5 },
    project_type: { type: String, required: true },
    soft_skills: [{ type: String }],
    languages: [{ type: String }],
    date_posted: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

JobSchema.pre<Query<any, any, any, any>>('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as UpdateQuery<any>;
  // Calculate proposalLeft by subtracting activities.proposals from proposalLimit
  if (update && update.activities && update.activities.proposals) {
    update.proposal_left = update.proposal_limit - update.activities.proposals;
  }
  next();
});

// JobSchema.pre('findOneAndUpdate', async function (this: any, doc: any) {
//   const oldStatus = doc.status;
//   const newStatus = this._update.status;

//   if (oldStatus !== newStatus) {
//     let status: string;
//     switch (newStatus) {
//       case 'taken':
//         status = 'cancelled';
//         break;
//       default:
//         status = 'pending';
//     }
//     await BiddingModel.updateMany({ job_id: doc._id }, { $set: { status } });
//   }
// });

const SavedJobSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  },
  {
    timestamps: true,
  },
);

const HireJobSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    job_id: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    client_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    proposal: { type: Schema.Types.ObjectId, ref: 'Bidding', required: true },
  },
  {
    timestamps: true,
  },
);

JobSchema.plugin(toJSON);
JobSchema.plugin(paginate);
HireJobSchema.plugin(paginate);
SavedJobSchema.plugin(toJSON);

const JobModel = model<IJob>('Job', JobSchema);
const SavedJob = model<any>('SavedJob', SavedJobSchema);
const Hire = model<any>('HireJob', HireJobSchema);

export { JobModel, SavedJob, Hire };
