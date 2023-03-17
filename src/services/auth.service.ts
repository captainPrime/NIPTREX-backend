import { hash } from 'bcrypt';
import httpStatus from 'http-status';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto, UserLoginDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { IUserDoc } from '@interfaces/users.interface';
import User from '@models/users.model';
import { isEmpty } from '@utils/util';
import ApiError from '@/exceptions/ApiError';
import { sendSuccessfulRegistration } from '@/modules/email/email.service';

class AuthService {
  public users = User;

  public async signup(userData: CreateUserDto): Promise<IUserDoc> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: IUserDoc | null = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: IUserDoc = await this.users.create({ ...userData, password: hashedPassword });
    //
    const tokenData = this.createToken(createUserData);
    const cookie = this.createCookie(tokenData);
    await sendSuccessfulRegistration(userData.email, cookie, userData.first_name);

    return createUserData;
  }

  public async loginUserWithEmailAndPassword(userData: UserLoginDto): Promise<{ cookie: string; user: IUserDoc }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const user: IUserDoc | null = await this.users.findOne({ email: userData.email });
    if (!user || !(await user.isPasswordMatch(user.password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }

    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);

    return { cookie, user };
  }

  public async logout(userData: IUserDoc): Promise<IUserDoc> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: IUserDoc | null = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

    return findUser;
  }

  public createToken(user: IUserDoc): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string | undefined = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { expiresIn, token: sign(dataStoredInToken, secretKey!, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
