export interface PaginationOptions {
  sortBy?: unknown;
  limit?: number;
  page?: number;
  projectBy?: unknown;
}

export interface IJob {
  jobsTags: string[];
  jobTitle: string;
  jobSubInfo: string;
  jobDescription: string;
  attachments: string[];
  links: string[];
  duration: string;
  hourly: number;
  experience_level: string;
  activities: {
    proposals: number;
    lastViewed?: Date;
    interviewing: number;
    invitesSent: number;
    unAnsweredInvites: number;
  };
  verified: boolean;
  rating: string;
  status: string;
  location: string;
  jobType: string;
  jobSize: string;
  industryType: string;
  industrySize: string;
  softSkills: string[];
  datePosted: Date;
}

export enum JobStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}
