/* eslint-disable security/detect-non-literal-regexp */
import { hash } from 'bcryptjs';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { IUser, IUserDoc, IUserModel, UpdateUserBody } from '@interfaces/users.interface';
import User from '@models/users.model';
import { isEmpty } from '@utils/util';
import mongoose from 'mongoose';
import { About } from '@/models/profile.model';

class UserService {
  public users = User;
  public about: any = About;

  public async findAllUser(): Promise<IUserModel[]> {
    const users: IUserModel[] = await this.users.find();
    return users;
  }

  public async findAllFreelancer(query: any): Promise<any[]> {
    const users: any[] = await this.users.find({ user: 'freelancer' });
    const abouts: any[] = [];

    for (const user of users) {
      const about = await this.about.findOne({ user_id: user._id, skills: { $in: new RegExp(query.skills, 'i') } });
      if (about) {
        const payload = {
          personal_details: about.personal_details,
          address: about.address,
          social_links: about.social_links,
          languages: about.languages,
          skills: about.skills,
        };
        abouts.push(payload);
      }
    }
    return abouts;
  }

  public async findUserById(userId: mongoose.Types.ObjectId | string): Promise<IUser | null> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

    const findUser: IUser | null = await this.users.findOne({ _id: userId });

    return findUser;
  }

  public async findUserByEmail(email: string): Promise<IUserDoc> {
    if (isEmpty(email)) throw new HttpException(400, 2003, 'Email should not be empty');

    const findUser: IUserDoc | null = await this.users.findOne({ email });
    if (!findUser) throw new HttpException(400, 2004, "You're not user");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<IUserModel> {
    if (isEmpty(userData)) throw new HttpException(400, 2005, "You're not userData");

    const findUser: IUserModel | null = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(400, 2006, `You're email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: IUserModel = (await this.users.create({ ...userData, password: hashedPassword })) as unknown as IUserModel;

    return createUserData;
  }

  public async updateUser(userId: mongoose.Types.ObjectId | string, userData: UpdateUserBody): Promise<IUserDoc> {
    if (isEmpty(userData)) throw new HttpException(400, 2007, 'Fields cannot be empty');

    if (userData.email && (await User.isEmailTaken(userData.email, userId))) {
      throw new HttpException(400, 2008, 'Email already taken');
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: IUserDoc | null = await this.users.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true,
    });
    if (!updateUserById) throw new HttpException(400, 2009, "You're not user");

    return updateUserById;
  }

  public async deleteUser(userId: mongoose.Types.ObjectId | string): Promise<IUserModel> {
    const deleteUserById: IUserModel | null = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(400, 2010, "You're not user");

    return deleteUserById;
  }
}

export default UserService;
