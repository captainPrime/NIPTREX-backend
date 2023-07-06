import {
  EmploymentType,
  IAbout,
  IBankInfo,
  IBilling,
  IBio,
  ICertification,
  IDocument,
  IEducationHistory,
  IExperience,
  IPreferences,
  WorkOption,
} from '@/interfaces/profile.interface';
import { toJSON } from '@/modules/toJSON';
import { Schema, model } from 'mongoose';

const experienceSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    company: { type: String, requiredrequired: true },
    country: { type: String, required: true },
    role: { type: String, required: true },
    company_image_url: { type: String, trim: true },
    employment_type: {
      type: String,
      enum: Object.values(EmploymentType),
      required: true,
    },
    description: { type: String },
  },
  {
    timestamps: true,
  },
);

const educationHistorySchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    id: { type: String, trim: true },
    institution: { type: String, trim: true },
    field_of_study: { type: String },
    degree_level: { type: String, trim: true },
    date_attended: { type: String, trim: true },
    graduation_date: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const certificationSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, trim: true },
  organisation: { type: String, trim: true },
  description: { type: String, trim: true },
  certificate_url: { type: String, trim: true },
  company_image_url: { type: String, trim: true },
  date_obtained: {
    type: String,
    trim: true,
  },
});

const billingSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    per_annum: { type: Number, required: true },
    hourly_rate: { type: Number, required: true }, // Updated to Number type
    payment_method: { type: String, enum: ['USD', 'NGN'], required: true }, // Updated to enum of USD and NGN
  },
  {
    timestamps: true,
  },
);

const identitySchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    proof_of_identity: { type: String, required: true },
    proof_of_address: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const bankInfoSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bank_name: { type: String, required: true },
    account_number: { type: String, required: true },
    account_name: { type: String, required: true },
    currency: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

const workPreference: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    industry_type: [{ type: String }],
    project_duration: {
      type: String,
      required: true,
    },
    team_size: {
      type: String,
      required: true,
    },
    work_location: {
      type: String,
      required: true,
    },
    job_type: {
      type: String,
      enum: Object.values(WorkOption),
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const aboutSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token_activities: [{ type: Schema.Types.ObjectId, ref: 'Token' }],
    total_earnings: { type: Number, default: 0 },
    total_jobs: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    nips: { type: Number, default: 100 },
    personal_details: {
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      email: { type: String, required: true },
      country: { type: String, required: true },
      profile_picture: { type: String, required: false, default: '' },
      dob: { type: String, required: true },
      role: { type: String, required: true },
      phone_number: { type: String, required: true },
      seniority: { type: String, required: true },
      gender: { type: String, required: true },
    },
    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    resume: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],
    social_links: {
      personal_website: { type: String },
      linkedin: { type: String },
      stack_overflow: { type: String },
      github: { type: String },
      dribble: { type: String },
      behance: { type: String },
      glass_door: { type: String },
    },
    languages: [{ type: String }],
    skills: [{ type: String }],
    available_to_work: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const bioSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    hourly_rate: { type: Number, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

aboutSchema.plugin(toJSON);
experienceSchema.plugin(toJSON);
educationHistorySchema.plugin(toJSON);
certificationSchema.plugin(toJSON);
billingSchema.plugin(toJSON);
identitySchema.plugin(toJSON);
workPreference.plugin(toJSON);
bankInfoSchema.plugin(toJSON);

// Define a virtual for total_hours
aboutSchema.virtual('total_hours').get(function (this: IAbout) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const tokenActivities: any[] = this.token_activities.filter((activity: any) => activity.createdAt >= sevenDaysAgo && activity.createdAt <= now);

  let totalHours = 0;
  tokenActivities.forEach((activity: any) => {
    totalHours += activity.expires.getTime() - activity.createdAt.getTime();
  });

  return totalHours;
});

const About = model<IAbout>('About', aboutSchema);
const Experience = model<IExperience>('Experience', experienceSchema);
const Education = model<IEducationHistory>('Education', educationHistorySchema);
const Certification = model<ICertification>('Certification', certificationSchema);
const Billing = model<IBilling>('Billing', billingSchema);
const Identity = model<IDocument>('Identity', identitySchema);
const Preference = model<IPreferences>('Preference', workPreference);
const Bio = model<IBio>('Bio', bioSchema);
const BankInfo = model<IBankInfo>('Bank', bankInfoSchema);

export { About, Experience, Education, Certification, Billing, Identity, Preference, Bio, BankInfo };
