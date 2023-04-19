import { IJob, JobStatus } from '@/interfaces/job.inteface';
import { paginate } from '@/modules/paginate';
import { toJSON } from '@/modules/toJSON';
import { Query, Schema, UpdateQuery, model } from 'mongoose';

const JobSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobsTags: [{ type: String, required: true }],
    jobTitle: { type: String, required: true },
    jobHeadline: { type: String, required: true },
    jobDescription: { type: String, required: true },
    attachments: [{ type: String }],
    links: [{ type: String }],
    duration: { type: String },
    hourly: { type: Number },
    budget: { type: String },
    proposalLimit: { type: Number, default: 50 },
    proposalLeft: { type: Number, default: 50 },
    experience_level: { type: String },
    activities: {
      proposals: { type: Number, default: 0 },
      lastViewed: { type: Date },
      interviewing: { type: Number, default: 0 },
      invitesSent: { type: Number, default: 0 },
      unAnsweredInvites: { type: Number, default: 0 },
    },
    verified: { type: Boolean, required: true, default: true },
    rating: { type: String, required: true },
    status: { type: String, enum: Object.values(JobStatus), default: JobStatus.ACTIVE },
    location: { type: String, required: true },
    jobType: { type: String, required: true },
    teamSize: { type: String, required: true },
    industryType: { type: String, required: true },
    industrySize: { type: String, required: true },
    companyType: { type: String, required: true },
    projectType: { type: String, required: true },
    softSkills: [{ type: String }],
    languages: [{ type: String }],
    datePosted: {
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
    update.proposalLeft = update.proposalLimit - update.activities.proposals;
  }
  next();
});

const SavedJobSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  },
  {
    timestamps: true,
  },
);

JobSchema.plugin(toJSON);
JobSchema.plugin(paginate);
SavedJobSchema.plugin(toJSON);

const JobModel = model<IJob>('Job', JobSchema);
const SavedJob = model<any>('SavedJob', SavedJobSchema);

export { JobModel, SavedJob };
