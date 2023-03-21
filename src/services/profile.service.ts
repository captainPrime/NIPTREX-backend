import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import profileModel from '@/models/profile.model';

class ProfileService {
  public profile = profileModel;

  public async createProfile(profileData: CreateUserDto): Promise<any> {
    if (isEmpty(profileData)) throw new HttpException(400, 2005, "You're not userData");

    // const findUser: IUserModel | null = await this.users.findOne({ email: userData.email });
    // if (findUser) throw new HttpException(400, 2006, `You're email ${userData.email} already exists`);

    const data = await this.profile.create(profileData);

    return data;
  }
}

export default ProfileService;
