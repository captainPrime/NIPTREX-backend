import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
import { CreateProfileDto } from '@/dtos/profile.dto';
import mongoose from 'mongoose';
import Profile from '@/models/profile.model';
import { IUpdateProfile } from '@/interfaces/profile.interface';

class ProfileService {
  public profile: any = Profile;
  public userService = new UserService();

  public async createProfile(profileData: CreateProfileDto): Promise<any> {
    if (isEmpty(profileData)) throw new HttpException(400, 2005, "You're not userData");

    const data: any = await this.profile.create(profileData);

    await this.userService.updateUser(data.user_id, { has_profile: true });

    return data;
  }

  public async getProfileById(userId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

    const profile: any | null = await this.profile.findOne({ user_id: userId });
    if (!profile) throw new HttpException(400, 2002, 'PROFILE_NOT_FOUND');

    return profile;
  }

  public async updateProfile(userId: mongoose.Types.ObjectId | string, data: IUpdateProfile): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

    const profile = await this.profile.findOne({ user_id: userId });
    if (!profile) throw new HttpException(400, 2002, 'PROFILE_NOT_FOUND');

    const updatedProfile = await this.profile.findByIdAndUpdate(profile._id, data, {
      new: true,
    });

    if (!updatedProfile) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return updatedProfile;
  }
}

export default ProfileService;
