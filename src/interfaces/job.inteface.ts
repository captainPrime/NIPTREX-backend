export interface PaginationOptions {
  sortBy?: unknown;
  limit?: number;
  page?: number;
  projectBy?: unknown;
}

export enum JobStatus {
  ACTIVE = 'active',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'inactive',
}

export interface IJob {
  jobsTags: string[];
  jobTitle: string;
  jobSubInfo: string;
  jobDescription: string;
  verified: boolean;
  rating: number;
  attachments: string[];
  links: string[];
  duration: number;
  hourly: number;
  level: string;
  activities: {
    proposals: number;
    lastViewed: Date;
    interviewing: number;
    invitesSent: number;
    unAnsweredInvites: number;
  };
  status: JobStatus;
  location: string;
  jobType: string;
  jobSize: string;
  createdAt: Date;
  updatedAt: Date;
}
