import { ITokenDoc } from '@/modules/token/token.interfaces';
import { Document } from 'mongoose';

export enum EmploymentType {
  FullTime = 'Full Time',
  PartTime = 'Part Time',
  Contract = 'Contract',
  Freelance = 'Freelance',
  Internship = 'Internship',
  Volunteer = 'Volunteer',
}

export enum JobTitle {
  'Artificial Intelligence Engineer',
  'Business Analyst',
  'Cloud Architect',
  'Cybersecurity Analyst',
  'Data Analyst',
  'Data Scientist',
  'Full-stack Developer',
  'Game Developer',
  'Information Security Analyst',
  'IT Manager',
  'Java Developer',
  'Machine Learning Engineer',
  'Mobile Application Developer',
  'Network Administrator',
  'Network Architect',
  'Project Manager',
  'Quality Assurance Analyst',
  'Robotics Engineer',
  'Software Developer',
  'Software Engineer',
  'System Administrator',
  'UI/UX Designer',
  'Web Developer',
}

export enum TeamSize {
  'Small team (4-6 members)',
  'Large team (9-10 members)',
  'X-Large team (11-16 members)',
}

export enum WorkSchedule {
  'Full time - Weekdays',
  'Weekdays (AM)',
  'Weekdays (PM)',
  'Weekends',
}

export enum JobDuration {
  'Mid-term (<6 months)',
  'Mid-term (6-12 months)',
  'Long-term (12 months or longer)',
}

export enum WorkOption {
  Remote = 'Remote',
  Hybrid = 'Hybrid',
  OnSite = 'Onsite',
  Freelance = 'Freelance',
}

export interface IAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
}

export interface ISocialLink {
  personal_website?: string;
  linkedin?: string;
  stack_overflow?: string;
  github?: string;
  dribble?: string;
  behance?: string;
  glass_door?: string;
}

export interface IExperience {
  id: string;
  start_date: Date;
  end_date: Date;
  company: string;
  country: string;
  role: string;
  employment_type: EmploymentType;
  description?: string;
}

export interface IEducationHistory {
  id: string;
  institution: string;
  field_of_study: string;
  degree_level: string;
  date_attended: Date;
  graduation_date: string;
}

export interface ICertification {
  id: string;
  name: string;
  organisation: string;
  certificate_url: string;
  date_obtained: Date;
}

export interface ILanguage {
  id: string;
  name: string;
}

export interface IBilling {
  per_annum: number;
  hourly_rate: number;
  payment_method: EPaymentMethod;
}

export interface IPreferences {
  industry_type: string[];
  project_duration: JobDuration;
  team_size: TeamSize;
  work_location: string;
  job_type: WorkOption;
}

export interface IDocument {
  proof_of_identity: string;
  proof_of_address: string;
}

export interface IPersonalDetails {
  profile_picture: string;
  dob: Date;
  role: string;
  seniority: string;
  gender: string;
  resume?: string;
}

export interface IAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
}

export interface ISocialLink {
  personal_website?: string;
  linkedin?: string;
  stack_overflow?: string;
  github?: string;
  dribble?: string;
  behance?: string;
  glass_door?: string;
}
export interface IAbout extends Document {
  token_activities: ITokenDoc[];
  total_earnings: number;
  total_jobs: number;
  total_hours: number;
  available: number;
  personal_details: IPersonalDetails;
  address: IAddress;
  social_details?: ISocialLink;
  languages?: string[];
  skills: string[];
  available_to_work: boolean;
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum EPaymentMethod {
  NGN = 'NGN',
  USD = 'USD',
}
export interface IUpdateAbout {
  personal_details?: Partial<IPersonalDetails>;
  address?: Partial<IAddress>;
  social_details?: Partial<ISocialLink>;
  languages?: string[];
  skills?: string[];
  available_to_work?: boolean;
}

export type IUpdateExperience = Partial<IExperience>;
export type IUpdateEducationHistory = Partial<IEducationHistory>;
export type IUpdateCertification = Partial<ICertification>;
export type IUpdateBilling = Partial<IBilling>;
export type IUpdateDocument = Partial<IDocument>;
export type IUpdatePreference = Partial<IPreferences>;
