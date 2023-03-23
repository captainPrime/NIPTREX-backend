import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import profileModel from '@/models/profile.model';
import UserService from './users.service';
import { CreateProfileDto } from '@/dtos/profile.dto';

class ProfileService {
  public userService = new UserService();

  public async createProfile(profileData: CreateProfileDto): Promise<any> {
    if (isEmpty(profileData)) throw new HttpException(400, 2005, "You're not userData");

    const data: any = await profileModel.create(profileData);

    await this.userService.updateUser(data.user_id, { has_profile: true });

    return data;
  }
}

export default ProfileService;
