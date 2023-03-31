import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
// import { CreateProfileDto } from '@/dtos/profile.dto';
import mongoose from 'mongoose';
import { Education } from '@/models/profile.model';
import { IEducationHistory, IUpdateEducationHistory } from '@/interfaces/profile.interface';
import { educationHistorySchema } from '@/validations/profile.validation';

class EducationService {
  public education: any = Education;
  public userService = new UserService();

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

    await this.userService.updateUser(data.user_id, { has_education: true });

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
}

export default EducationService;
