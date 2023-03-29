import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
// import { CreateProfileDto } from '@/dtos/profile.dto';
import mongoose from 'mongoose';
import { Experience, Education } from '@/models/profile.model';
import { IExperience, IUpdateExperience } from '@/interfaces/profile.interface';
import { experienceValidation } from '@/validations/profile.validation';

class ProfileService {
  public experience: any = Experience;
  public education: any = Education;
  public userService = new UserService();

  /*
  |--------------------------------------------------------------------------
  | Add Comment
  |--------------------------------------------------------------------------
  */
  // public async createProfile(profileData: CreateProfileDto): Promise<any> {
  //   if (isEmpty(profileData)) throw new HttpException(400, 2005, "You're not userData");

  //   const data: any = await this.profile.create(profileData);

  //   await this.userService.updateUser(data.user_id, { has_profile: true });

  //   return data;
  // }

  /*
  |--------------------------------------------------------------------------
  | Add Comment
  |--------------------------------------------------------------------------
  */
  public async createExperience(body: IExperience): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 2005, "You're not userData");

    const { error } = experienceValidation.validate(body);

    if (error) throw new HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);

    const data: any = await this.experience.create(body);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Add Comment
  |--------------------------------------------------------------------------
  */
  public async getUserExperience(userId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

    const data = await this.experience.find({ user_id: userId });
    if (!data) throw new HttpException(400, 2002, 'PROFILE_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Add Comment
  |--------------------------------------------------------------------------
  */
  public async getExperienceById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.experience.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'PROFILE_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Add Comment
  |--------------------------------------------------------------------------
  */
  public async updateExperienceById(id: mongoose.Types.ObjectId | string, body: IUpdateExperience): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.experience.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'EXPERIENCE_NOT_FOUND');

    const updatedData = await this.experience.findByIdAndUpdate(data._id, body, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Add Comment
  |--------------------------------------------------------------------------
  */
  public async deleteExperience(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.experience.findByIdAndDelete(id);
    if (!data) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Add Comment
  |--------------------------------------------------------------------------
  */
  // public async getProfileById(userId: mongoose.Types.ObjectId | string): Promise<any> {
  //   if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

  //   const profile: any | null = await this.profile.findOne({ user_id: userId });
  //   if (!profile) throw new HttpException(400, 2002, 'PROFILE_NOT_FOUND');

  //   return profile;
  // }

  // /*
  // |--------------------------------------------------------------------------
  // | Add Comment
  // |--------------------------------------------------------------------------
  // */
  // public async updateProfile(userId: mongoose.Types.ObjectId | string, data: IUpdateProfile): Promise<any> {
  //   if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

  //   const profile = await this.profile.findOne({ user_id: userId });
  //   if (!profile) throw new HttpException(400, 2002, 'PROFILE_NOT_FOUND');

  //   const updatedProfile = await this.profile.findByIdAndUpdate(profile._id, data, {
  //     new: true,
  //   });

  //   if (!updatedProfile) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

  //   return updatedProfile;
  // }
}

export default ProfileService;
