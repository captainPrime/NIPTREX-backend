export interface PaginationOptions {
  sortBy?: unknown;
  limit?: number;
  page?: number;
  projectBy?: unknown;
}

export interface IJob {
  jobsTags: string[];
  jobTitle: string;
  jobHeadline: string;
  jobDescription: string;
  attachments?: string[];
  links?: string[];
  duration?: string;
  hourly?: number;
  budget?: string;
  experience_level?: string;
  activities?: {
    proposals: number;
    lastViewed?: Date;
    interviewing: number;
    invitesSent: number;
    unAnsweredInvites: number;
  };
  verified: string;
  rating: string;
  status?: string;
  location: string;
  jobType: string;
  teamSize: string;
  industryType: string;
  industrySize: string;
  companyType: string;
  projectType: string;
  softSkills?: string[];
  languages?: string[];
  datePosted?: Date;
}

export type IUpdateJob = Partial<IJob>;

export enum JobStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}
