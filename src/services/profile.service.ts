import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
// import { CreateProfileDto } from '@/dtos/profile.dto';
import mongoose from 'mongoose';
import { Experience, Education } from '@/models/profile.model';
import { IEducationHistory, IExperience, IUpdateEducationHistory, IUpdateExperience } from '@/interfaces/profile.interface';
import { educationHistorySchema, experienceValidation } from '@/validations/profile.validation';

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
  | Create Experience
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
  | Get User Experience
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
  | Get Experience By Id
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
  | Update Experience By Id
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
  | Delete Experience
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
  | Create Education
  |--------------------------------------------------------------------------
  */
  public async createEducation(body: IEducationHistory): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 2005, "You're not userData");

    const { error } = educationHistorySchema.validate(body);

    if (error) throw new HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);

    const data: any = await this.education.create(body);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Education
  |--------------------------------------------------------------------------
  */
  public async getUserEducation(userId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

    const data = await this.education.find({ user_id: userId });
    if (!data) throw new HttpException(400, 2002, 'EDUCATION_HISTORY_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Education By Id
  |--------------------------------------------------------------------------
  */
  public async getEducationById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.education.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'EDUCATION_HISTORY_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Education By Id
  |--------------------------------------------------------------------------
  */
  public async updateEducationById(id: mongoose.Types.ObjectId | string, body: IUpdateEducationHistory): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.education.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'EDUCATION_HISTORY_NOT_FOUND');

    const updatedData = await this.education.findByIdAndUpdate(data._id, body, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Education
  |--------------------------------------------------------------------------
  */
  public async deleteEducation(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.education.findByIdAndDelete(id);
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
