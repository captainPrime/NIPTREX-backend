import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserService from './users.service';
import mongoose from 'mongoose';
import { Certification } from '@/models/profile.model';
import { ICertification, IUpdateCertification } from '@/interfaces/profile.interface';
import { certificationSchema, certificationUpdateSchema } from '@/validations/profile.validation';

class CertificationService {
  public userService = new UserService();
  public certification: any = Certification;

  /*
  |--------------------------------------------------------------------------
  | Create Certification
  |--------------------------------------------------------------------------
  */
  public async createCertification(body: ICertification): Promise<any> {
    if (isEmpty(body)) throw new HttpException(400, 2005, "You're not userData");

    const { error } = certificationSchema.validate(body);

    if (error) throw new HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);

    const data: any = await this.certification.create(body);

    await this.userService.updateUser(data.user_id, { has_certification: true });

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get User Certification
  |--------------------------------------------------------------------------
  */
  public async getUserCertification(userId: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 2001, 'User id can not be empty');

    const data = await this.certification.find({ user_id: userId });
    if (!data) throw new HttpException(400, 2002, 'CERTIFICATION_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Certification By Id
  |--------------------------------------------------------------------------
  */
  public async getCertificationById(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.certification.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'CERTIFICATION_NOT_FOUND');

    return data;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Certification By Id
  |--------------------------------------------------------------------------
  */
  public async updateCertificationById(id: mongoose.Types.ObjectId | string, body: IUpdateCertification): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const { error } = certificationUpdateSchema.validate(body);

    if (error) throw new HttpException(400, 2002, 'PROFILE_VALIDATION_ERROR', [error.details[0].message]);

    const data = await this.certification.findOne({ _id: id });
    if (!data) throw new HttpException(400, 2002, 'CERTIFICATION_NOT_FOUND');

    const updatedData = await this.certification.findByIdAndUpdate(data._id, body, {
      new: true,
    });

    if (!updatedData) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return updatedData;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Certification
  |--------------------------------------------------------------------------
  */
  public async deleteCertification(id: mongoose.Types.ObjectId | string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 2001, 'id can not be empty');

    const data = await this.certification.findByIdAndDelete(id);
    if (!data) throw new HttpException(400, 2009, 'PROFILE_REQUEST_ERROR');

    return data;
  }
}

export default CertificationService;
