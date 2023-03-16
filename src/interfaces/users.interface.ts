import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '@/modules/paginate/paginate';

export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  user: string;
  isEmailVerified: boolean;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  _id: mongoose.Types.ObjectId;
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
