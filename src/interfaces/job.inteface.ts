import { Document, Types } from 'mongoose';

export interface PaginationOptions {
  sortBy?: unknown;
  limit?: number;
  page?: number;
  populate?: string;
  projectBy?: unknown;
}

export interface IJob extends Document {
  user_id: Types.ObjectId;
  freelancer_id: Types.ObjectId | string;
  jobs_tags: string[];
  job_title: string;
  job_headline: string;
  job_description: string;
  attachments?: string[];
  links?: string[];
  project_duration?: string;
  hourly_rate?: {
    min?: number;
    max?: number;
  };
  budget?: number;
  project_fixed?: boolean;
  proposal_limit?: number;
  proposal_left?: number;
  experience_level?: string;
  activities?: {
    proposals?: number;
    last_viewed?: Date;
    interviewing?: number;
    invites_sent?: number;
    unanswered_invites?: number;
  };
  verified?: boolean;
  rating?: number;
  status?: string;
  work_location?: string;
  job_type?: string;
  team_size?: string;
  industry_type?: string;
  nips?: number;
  project_type?: string;
  soft_skills?: string[];
  languages?: string[];
  date_posted?: Date;
}

export type IUpdateJob = Partial<IJob>;

export enum JobStatus {
  ACTIVE = 'active',
  TAKEN = 'taken',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}
