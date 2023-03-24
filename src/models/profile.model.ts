import { Schema, Document, model } from 'mongoose';

enum EmploymentType {
  FullTime = 'Full Time',
  PartTime = 'Part Time',
  Contract = 'Contract',
  Freelance = 'Freelance',
  Internship = 'Internship',
  Volunteer = 'Volunteer',
}

enum JobTitle {
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

enum TeamSize {
  'Small team (4-6 members)',
  'Large team (9-10 members)',
  'X-Large team (11-16 members)',
}

enum WorkSchedule {
  'Full time - Weekdays',
  'Weekdays (AM)',
  'Weekdays (PM)',
  'Weekends',
}

enum JobDuration {
  'Mid-term (<6 months)',
  'Mid-term (6-12 months)',
  'Long-term (12 months or longer)',
}

enum WorkOption {
  Remote = 'Remote',
  Hybrid = 'Hybrid',
  OnSite = 'On-site',
}

interface IPersonalDetails {
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  profile_picture: string;
  dob: Date;
  role: string;
  phone_number: string;
  seniority: string;
  gender: string;
}

interface IAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
}

interface ISocialLink {
  personal_website?: string;
  linkedin?: string;
  stack_overflow?: string;
  github?: string;
  dribble?: string;
  behance?: string;
  glass_door?: string;
}

interface IExperience {
  id: string;
  start_date: Date;
  end_date: Date;
  company: string;
  country: string;
  role: string;
  employment_type: EmploymentType;
  description?: string;
}

interface IEducationHistory {
  id: string;
  institution: string;
  field_of_study: string;
  degree_level: string;
  date_attended: Date;
  employment_type: EmploymentType;
}

interface ICertification {
  id: string;
  name: string;
  organisation: string;
  certificate_url: string;
  date_obtained: Date;
}

interface ILanguage {
  id: string;
  name: string;
}

interface IBilling {
  per_annum: string;
  hourly_rate: string;
  payment_method: string;
}

interface IPreferences {
  industry_type: JobTitle;
  company_culture: TeamSize;
  company_size: TeamSize;
  project_duration: JobDuration;
  team_size: TeamSize;
  work_location: WorkOption;
  work_timezone: string;
  work_preference: WorkSchedule;
}

interface IDocument {
  proof_of_identity: string;
  proof_of_address: string;
}

interface IProfile extends Document {
  personal_details: IPersonalDetails;
  address: IAddress;
  social_details?: ISocialLink;
  languages?: ILanguage[];
  experiences?: IExperience[];
  education_history?: IEducationHistory[];
  certification?: ICertification[];
  billing?: IBilling;
  preference?: IPreferences;
  identity?: IDocument;
}

export type IUpdateProfile = Partial<IProfile>;

const profileSchema: Schema = new Schema({
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
});

const Profile = model<IProfile>('Profile', profileSchema);

export default Profile;
