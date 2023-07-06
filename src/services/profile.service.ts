import mongoose from 'mongoose';

import { isEmpty } from '@utils/util';
import UserService from './users.service';
import { HttpException } from '@exceptions/HttpException';
import { educationHistorySchema, experienceValidation } from '@/validations/profile.validation';
import { Experience, Education, Certification, Preference, Identity, Billing, About, Bio, BankInfo } from '@/models/profile.model';
import { IEducationHistory, IExperience, IUpdateEducationHistory, IUpdateExperience } from '@/interfaces/profile.interface';

class ProfileService {
  public bio: any = Bio;
  public about: any = About;
  public bank: any = BankInfo;
  public billing: any = Billing;
  public identity: any = Identity;
  public education: any = Education;
  public experience: any = Experience;
  public preference: any = Preference;
  public certification: any = Certification;
  public userService = new UserService();

  /*
  |--------------------------------------------------------------------------
  | Add Comment
  |--------------------------------------------------------------------------
  */
  public async getProfile(userId: string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2005, "You're not userData");

    const findOneUserData: any = await this.userService.findUserById(userId);

    if (findOneUserData.user === 'client') {
      return findOneUserData;
    }

    const bio = await this.bio.findOne({ user_id: userId });
    const bank = await this.bank.findOne({ user_id: userId });
    const about = await this.about.findOne({ user_id: userId });
    const billing = await this.billing.find({ user_id: userId });
    const identity = await this.identity.find({ user_id: userId });
    const education = await this.education.find({ user_id: userId });
    const experience = await this.experience.find({ user_id: userId });
    const preference = await this.preference.find({ user_id: userId });
    const certification = await this.certification.find({ user_id: userId });

    // Define a function to calculate the percentage of profile completion
    const calculateProfileCompletion = (userProfile: any) => {
      let completion = 0;
      if (userProfile.personal_details) completion += 10;
      if (userProfile.address) completion += 10;
      if (userProfile.social_links) completion += 10;
      if (userProfile.languages) completion += 10;
      if (userProfile.work_preferences) completion += 10;
      if (userProfile.education_history.length !== 0) completion += 10;
      if (userProfile.experience.length !== 0) completion += 10;
      if (userProfile.certification.length !== 0) completion += 10;
      if (userProfile.proof_of_identity) completion += 10;
      if (userProfile.billing) completion += 10;
      return `${completion}%`;
    };

    const profile = {
      user_id: userId,
      total_earnings: about?.total_earnings,
      total_jobs: about?.total_jobs,
      available: about?.available,
      nips: about?.nips,
      personal_details: about?.personal_details,
      address: about?.address,
      skills: about?.skills,
      resume: about?.resume,
      available_to_work: about?.available_to_work,
      social_links: about?.social_links,
      languages: about?.languages,
      rating: findOneUserData.rating,
      bio: bio,
      work_preferences: preference[0],
      education_history: education,
      experience,
      certification,
      proof_of_identity: identity[0],
      billing: billing[0],
      bank: bank,
      created_at: findOneUserData.createdAt,
      updated_at: findOneUserData.updatedAt,
    };

    console.log(about);
    const profile_percentage = calculateProfileCompletion(profile);

    return { profile_percentage, profile };
  }

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

    await this.userService.updateUser(data.user_id, { has_profile: true, has_experience: true });

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
