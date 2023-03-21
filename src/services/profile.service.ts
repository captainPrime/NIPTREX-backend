import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import profileModel from '@/models/profile.model';

class ProfileService {
  public async createProfile(profileData: CreateUserDto): Promise<any> {
    if (isEmpty(profileData)) throw new HttpException(400, 2005, "You're not userData");

    const data = await profileModel.create(profileData);

    return data;
  }
}

export default ProfileService;
