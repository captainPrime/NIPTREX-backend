import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '@/modules/paginate/paginate';
import { AccessAndRefreshTokens } from '@/modules/token/token.interfaces';

export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_picture: string;
  password: string;
  user: string;
  rating: number;
  country: string;
  verified: boolean;
  has_profile: boolean;
  has_about: boolean;
  has_experience: boolean;
  has_education: boolean;
  has_certification: boolean;
  has_billing: boolean;
  has_identity: boolean;
  has_work_preference: boolean;
  is_profile_completed: boolean;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  _id: mongoose.Types.ObjectId;
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId | string): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<IUser, 'role' | 'verified'>;

export type NewCreatedUser = Omit<IUser, 'verified'>;

export interface IUserWithTokens {
  user: IUserModel;
  tokens: AccessAndRefreshTokens;
}
