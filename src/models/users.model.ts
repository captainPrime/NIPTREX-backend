import { model, Schema, ObjectId } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUserDoc, IUserModel } from '@interfaces/users.interface';
import { toJSON } from '@/modules/toJSON';
import { paginate } from '@/modules/paginate';

const userSchema = new Schema<IUserDoc, IUserModel>(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone_number: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    user: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isEmailTaken', async function (email: string, excludeUserId: ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
});

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method('isPasswordMatch', async function (password: string): Promise<boolean> {
  const user = this;
  return bcrypt.compare(password, user.password);
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = model<IUserDoc, IUserModel>('User', userSchema);

export default User;
