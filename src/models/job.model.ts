import { IJob, JobStatus } from '@/interfaces/job.inteface';
import { paginate } from '@/modules/paginate';
import { toJSON } from '@/modules/toJSON';
import { Schema, model } from 'mongoose';

const JobSchema: Schema = new Schema(
  {
    jobsTags: [{ type: String, required: true }],
    jobTitle: { type: String, required: true },
    jobSubInfo: { type: String, required: true },
    jobDescription: { type: String, required: true },
    attachments: [{ type: String }],
    links: [{ type: String }],
    duration: { type: String },
    hourly: { type: Number },
    experience_level: { type: String },
    activities: {
      proposals: { type: Number, default: 0 },
      lastViewed: { type: Date },
      interviewing: { type: Number, default: 0 },
      invitesSent: { type: Number, default: 0 },
      unAnsweredInvites: { type: Number, default: 0 },
    },
    verified: { type: String, required: true },
    rating: { type: String, required: true },
    status: { type: String, enum: Object.values(JobStatus), default: JobStatus.ACTIVE },
    location: { type: String, required: true },
    jobType: { type: String, required: true },
    jobSize: { type: String, required: true },
    industryType: { type: String, required: true },
    industrySize: { type: String, required: true },
    softSkills: [{ type: String }],
    datePosted: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

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
