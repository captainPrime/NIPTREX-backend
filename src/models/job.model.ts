import { toJSON } from '@/modules/toJSON';
import { Schema, model } from 'mongoose';

export interface IJob {
  jobsTags: string[];
  jobTitle: string;
  jobSubInfo: string;
  jobDescription: string;
  verified: boolean;
  rating: number;
  location: string;
  jobType: string;
  jobSize: string;
}

enum JobStatus {
  ACTIVE = 'active',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
}

const JobSchema: Schema = new Schema(
  {
    jobsTags: [{ type: String, required: true }],
    jobTitle: { type: String, required: true },
    jobSubInfo: { type: String, required: true },
    jobDescription: { type: String, required: true },
    verified: { type: String, required: true },
    rating: { type: String, required: true },
    status: { type: String, enum: Object.values(JobStatus), default: JobStatus.ACTIVE },
    is_saved: { type: Boolean, default: false },
    location: { type: String, required: true },
    jobType: { type: String, required: true },
    jobSize: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const SavedJobSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    job_id: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    jobsTags: [{ type: String, required: true }],
    jobTitle: { type: String, required: true },
    jobSubInfo: { type: String, required: true },
    jobDescription: { type: String, required: true },
    verified: { type: String, required: true },
    status: { type: String, enum: Object.values(JobStatus), default: JobStatus.ACTIVE },
    rating: { type: String, required: true },
    location: { type: String, required: true },
    jobType: { type: String, required: true },
    jobSize: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

JobSchema.plugin(toJSON);
SavedJobSchema.plugin(toJSON);

const JobModel = model<IJob>('Job', JobSchema);
const SavedJob = model<any>('SavedJob', SavedJobSchema);

export { JobModel, SavedJob };
