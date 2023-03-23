import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import profileModel, { IUpdateProfile } from '@/models/profile.model';
import UserService from './users.service';
import { CreateProfileDto } from '@/dtos/profile.dto';
import mongoose from 'mongoose';

class ProfileService {
  public userService = new UserService();

  public async createProfile(profileData: CreateProfileDto): Promise<any> {
    if (isEmpty(profileData)) throw new HttpException(400, 2005, "You're not userData");

    const data: any = await profileModel.create(profileData);

    await this.userService.updateUser(data.user_id, { has_profile: true });

    return data;
  }

  public async getProfileById(userId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

    const profile: any | null = await profileModel.findOne({ user_id: userId });
    if (!profile) throw new HttpException(400, 2002, 'PROFILE_NOT_FOUND');

    return profile;
  }

  public async updateProfile(userId: mongoose.Types.ObjectId | string, data: IUpdateProfile): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

    const profile: any | null = await profileModel.findOne({ user_id: userId });
    if (!profile) throw new HttpException(400, 2002, 'PROFILE_NOT_FOUND');

    const updatedProfile: any | null = await profileModel.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });

    return updatedProfile;
  }
}

export default ProfileService;
