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
  level: string;
  activities: {
    proposals: number;
    lastViewed?: Date;
    interviewing: number;
    invitesSent: number;
    unAnsweredInvites: number;
  };
  verified: string;
  rating: string;
  status: JobStatus;
  location: string;
  jobType: string;
  jobSize: string;
  datePosted: string;
}

export enum JobStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}
