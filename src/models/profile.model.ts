import {
  EmploymentType,
  IAbout,
  IBilling,
  ICertification,
  IDocument,
  IEducationHistory,
  IExperience,
  IPreferences,
} from '@/interfaces/profile.interface';
import { toJSON } from '@/modules/toJSON';
import { Schema, model } from 'mongoose';

const experienceSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    company: { type: String, requiredrequired: true },
    country: { type: String, required: true },
    role: { type: String, required: true },
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

const certificationSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, trim: true },
    organisation: { type: String, trim: true },
    certificate_url: { type: String, trim: true },
    date_obtained: { type: Date, trim: true },
  },
  {
    timestamps: true,
  },
);

const billingSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    per_annum: { type: String, required: true },
    hourly_rate: { type: String, trequiredrim: true },
    payment_method: { type: String, required: true },
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

const workPreference: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    industry_type: [{ type: String }],
    company_culture: [{ type: String }],
    company_size: {
      type: String,
      required: true,
    },
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
    work_timezone: {
      type: String,
      required: true,
    },
    work_preference: {
      type: String,
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
    personal_details: {
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      email: { type: String, required: true },
      country: { type: String, required: true },
      profile_picture: { type: String, required: true },
      dob: { type: String, required: true },
      role: { type: String, required: true },
      phone_number: { type: String, required: true },
      seniority: { type: String, required: true },
      gender: { type: String, required: true },
      resume: { type: String },
    },
    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
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

const About = model<IAbout>('About', aboutSchema);
const Experience = model<IExperience>('Experience', experienceSchema);
const Education = model<IEducationHistory>('Education', educationHistorySchema);
const Certification = model<ICertification>('Certification', certificationSchema);
const Billing = model<IBilling>('Billing', billingSchema);
const Identity = model<IDocument>('Identity', identitySchema);
const Preference = model<IPreferences>('Preference', workPreference);

export { About, Experience, Education, Certification, Billing, Identity, Preference };
