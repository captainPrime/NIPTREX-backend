import { ITokenDoc } from '../modules/token/token.interfaces';
import { Document, Schema } from 'mongoose';
export declare enum EmploymentType {
    FullTime = "Full Time",
    PartTime = "Part Time",
    Contract = "Contract",
    Freelance = "Freelance",
    Internship = "Internship",
    Volunteer = "Volunteer"
}
export declare enum JobTitle {
    'Artificial Intelligence Engineer' = 0,
    'Business Analyst' = 1,
    'Cloud Architect' = 2,
    'Cybersecurity Analyst' = 3,
    'Data Analyst' = 4,
    'Data Scientist' = 5,
    'Full-stack Developer' = 6,
    'Game Developer' = 7,
    'Information Security Analyst' = 8,
    'IT Manager' = 9,
    'Java Developer' = 10,
    'Machine Learning Engineer' = 11,
    'Mobile Application Developer' = 12,
    'Network Administrator' = 13,
    'Network Architect' = 14,
    'Project Manager' = 15,
    'Quality Assurance Analyst' = 16,
    'Robotics Engineer' = 17,
    'Software Developer' = 18,
    'Software Engineer' = 19,
    'System Administrator' = 20,
    'UI/UX Designer' = 21,
    'Web Developer' = 22
}
export declare enum TeamSize {
    'Small team (4-6 members)' = 0,
    'Large team (9-10 members)' = 1,
    'X-Large team (11-16 members)' = 2
}
export declare enum WorkSchedule {
    'Full time - Weekdays' = 0,
    'Weekdays (AM)' = 1,
    'Weekdays (PM)' = 2,
    'Weekends' = 3
}
export declare enum JobDuration {
    'Mid-term (<6 months)' = 0,
    'Mid-term (6-12 months)' = 1,
    'Long-term (12 months or longer)' = 2
}
export declare enum WorkOption {
    Remote = "Remote",
    Hybrid = "Hybrid",
    OnSite = "Onsite",
    Freelance = "Freelance"
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
    company_image_url: string;
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
    description: string;
    certificate_url: string;
    company_image_url: string;
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
    bank_name: string;
    account_number: number;
    account_name: string;
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
    profile_picture?: string;
    dob: Date;
    role: string;
    seniority: string;
    gender: string;
}
export interface IAddress {
    line1: string;
    line2?: string;
    city: string;
    state: string;
}
export interface IResume {
    name?: string;
    url?: string;
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
    available: number;
    nips: number;
    personal_details: Partial<IPersonalDetails>;
    address: IAddress;
    social_details?: ISocialLink;
    languages?: string[];
    resume?: IResume[];
    skills: string[];
    available_to_work: boolean;
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare enum EPaymentMethod {
    NGN = "NGN",
    USD = "USD"
}
export interface IUpdateAbout {
    total_earnings?: number;
    total_jobs?: number;
    available?: number;
    nips?: number;
    personal_details?: Partial<IPersonalDetails>;
    address?: Partial<IAddress>;
    social_details?: Partial<ISocialLink>;
    resume?: Partial<IResume>;
    languages?: string[];
    skills?: string[];
    available_to_work?: boolean;
}
export interface IBio {
    title: string;
    hourly_rate: number;
    description: string;
}
export interface IBillingAddress {
    user_id: Schema.Types.ObjectId | string;
    full_name: string;
    company: string;
    state: string;
    address: string;
    city: string;
    postal_number: number;
}
export type IUpdateExperience = Partial<IExperience>;
export type IUpdateEducationHistory = Partial<IEducationHistory>;
export type IUpdateCertification = Partial<ICertification>;
export type IUpdateBilling = Partial<IBilling>;
export type IUpdateDocument = Partial<IDocument>;
export type IUpdatePreference = Partial<IPreferences>;
export type IUpdateBio = Partial<IBio>;
export type IUpdateBillingAddress = Partial<IBillingAddress>;
