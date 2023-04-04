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

const JobSchema: Schema = new Schema(
  {
    jobsTags: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobSubInfo: { type: String, required: true },
    jobDescription: { type: String, required: true },
    verified: { type: String, required: true },
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

export const JobModel = model<IJob>('Job', JobSchema);
