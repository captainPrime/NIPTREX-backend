import { EmploymentType, IProfile, JobDuration, JobTitle, TeamSize, WorkOption, WorkSchedule } from '@/interfaces/profile.interface';
import { Schema, model } from 'mongoose';

const profileSchema: Schema = new Schema(
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
    languages: [
      {
        id: { type: String },
        name: { type: String },
      },
    ],
    experience: [
      {
        id: { type: String, trim: true },
        start_date: { type: Date, trim: true },
        end_date: { type: Date, trim: true },
        company: { type: String, trim: true },
        country: { type: String, trim: true },
        role: { type: String, trim: true },
        employment_type: {
          type: String,
          enum: Object.values(EmploymentType),
          trim: true,
        },
        description: { type: String },
      },
    ],
    education_history: [
      {
        id: { type: String, trim: true },
        institution: { type: String, trim: true },
        field_of_study: { type: String },
        degree_level: { type: String, trim: true },
        date_attended: { type: String, trim: true },
        employment_type: {
          type: String,
          enum: Object.values(EmploymentType),
          trim: true,
        },
      },
    ],
    work_preference: {
      industry_type: {
        type: String,
        enum: Object.values(JobTitle),
        trim: true,
      },
      company_culture: {
        type: String,
        enum: Object.values(TeamSize),
        trim: true,
      },
      company_size: {
        type: String,
        enum: Object.values(TeamSize),
        trim: true,
      },
      project_duration: {
        type: String,
        enum: Object.values(JobDuration),
        trim: true,
      },
      team_size: {
        type: String,
        enum: Object.values(TeamSize),
        trim: true,
      },
      work_location: {
        type: String,
        enum: Object.values(WorkOption),
        trim: true,
      },
      work_timezone: {
        type: String,
        trim: true,
      },
      work_preference: {
        type: String,
        enum: Object.values(WorkSchedule),
        trim: true,
      },
    },
    identity: {
      proof_of_identity: { type: String, trim: true },
      proof_of_address: { type: String, trim: true },
    },
    certification: [
      {
        id: { type: String, trim: true },
        name: { type: String, trim: true },
        organisation: { type: String, trim: true },
        certificate_url: { type: String, trim: true },
        date_obtained: { type: Date, trim: true },
      },
    ],
    billing: {
      per_annum: { type: String, trim: true },
      hourly_rate: { type: String, trim: true },
      payment_method: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  },
);

const Profile = model<IProfile>('Profile', profileSchema);

export default Profile;
