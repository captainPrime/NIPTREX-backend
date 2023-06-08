/* eslint-disable security/detect-object-injection */
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
import mongoose from 'mongoose';
import { About } from '@/models/profile.model';
import { IAbout, IUpdateAbout } from '@/interfaces/profile.interface';
import { aboutSchema, updateAboutSchema, updateResumeValidation } from '@/validations/profile.validation';

class AboutService {
  public about: any = About;
  public userService = new UserService();

  /*
  |--------------------------------------------------------------------------
  | Create About
  |--------------------------------------------------------------------------
  */
  public async createAbout(body: IAbout): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 2005, "You're not userData");

    const { error } = aboutSchema.validate(body);

    if (error) throw new HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);

    const data: any = await this.about.create(body);

    await this.userService.updateUser(data.user_id, { has_profile: true, has_about: true });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User About
  |--------------------------------------------------------------------------
  */
  public async getUserAbout(userId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

    const data = await this.about.findOne({ user_id: userId });
    // if (!data) throw new HttpException(400, 2002, 'ABOUT_NOT_FOUND');
    console.log('ABOUT', data);

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get About By Id
  |--------------------------------------------------------------------------
  */
  public async getAboutById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.about.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'ABOUT_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Update About By Id
  |--------------------------------------------------------------------------
  */
  public async updateAboutById(id: mongoose.Types.ObjectId | string, body: IUpdateAbout): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const user = await this.userService.findUserById(id);
    if (!user) throw new HttpException(400, 2002, 'USER_NOT_FOUND');

    if (body.personal_details?.profile_picture && user.user === 'client') {
      await this.userService.updateUser(id, { profile_picture: body.personal_details?.profile_picture });
    }

    const { error } = updateAboutSchema.validate(body);
    if (error) throw new HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);

    const data = await this.about.findOne({ user_id: id });
    if (!data) throw new HttpException(400, 2002, 'ABOUT_NOT_FOUND');

    // Update the desired fields dynamically from the request body
    const updatedPayload = {
      ...data.toObject(),
      personal_details: {
        ...data.personal_details.toObject(),
        ...body.personal_details, // Update the fields specified in the request body
      },
      address: { ...data.address.toObject(), ...body.address }, // Update the fields specified in the request body
      total_earnings: body.total_earnings || data.total_earnings,
      total_jobs: body.total_jobs || data.total_jobs,
      available: body.available || data.available,
      nips: body.nips || data.nips,
      social_links: { ...data.social_links.toObject(), ...body.social_details }, // Update the fields specified in the request body
      languages: body.languages || data.languages, // Update the fields specified in the request body or use the existing value
      skills: body.skills || data.skills, // Update the fields specified in the request body or use the existing value
      available_to_work: body.available_to_work || data.available_to_work, // Update the fields specified in the request body or use the existing value
      resume: body.resume || data.resume, // Update the fields specified in the request body or use the existing value
    };

    // Update the document with the updated payload
    const updatedData = await this.about.findByIdAndUpdate(data._id, updatedPayload, { new: true });
    await this.userService.updateUser(id, { profile_picture: body.personal_details?.profile_picture });

    if (!updatedData) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Update About By Id
  |--------------------------------------------------------------------------
  */
  public async updateResumeById(id: mongoose.Types.ObjectId | string, body: { name: string; url: string }, resumeId: string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const { error } = updateResumeValidation.validate(body);
    if (error) throw new HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);

    const about = await this.about.findOne({ user_id: id });
    if (!about) throw new HttpException(400, 2002, 'ABOUT_NOT_FOUND');

    const resumeItem = about.resume.find((item: any) => item.id === resumeId);
    if (!resumeItem) {
      throw new HttpException(400, 2002, 'RESUME_ITEM_NOT_FOUND');
    }

    resumeItem.name = body.name;
    resumeItem.url = body.url;

    // Update the document with the updated payload
    const updatedAbout = await this.about.findByIdAndUpdate(about._id, about, { new: true });

    if (!updatedAbout) {
      throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
    }
    return updatedAbout;
  }

  public async deleteResumeById(id: mongoose.Types.ObjectId | string, resumeId: string): Promise<any> {
    if (isEmpty(id)) {
      throw new HttpException(400, 2001, 'id cannot be empty');
    }

    const about = await this.about.findOne({ user_id: id });
    if (!about) {
      throw new HttpException(400, 2002, 'ABOUT_NOT_FOUND');
    }

    const resumeItemIndex = about.resume.findIndex((item: any) => item.id === resumeId);
    if (resumeItemIndex === -1) {
      throw new HttpException(400, 2002, 'RESUME_ITEM_NOT_FOUND');
    }

    about.resume.splice(resumeItemIndex, 1);

    // Update the document with the updated payload
    const updatedAbout = await this.about.findByIdAndUpdate(about._id, about, { new: true });

    if (!updatedAbout) {
      throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');
    }

    return updatedAbout;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete About
  |--------------------------------------------------------------------------
  */
  public async deleteAbout(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.about.findByIdAndDelete(id);
    if (!data) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return data;
  }
}

export default AboutService;
