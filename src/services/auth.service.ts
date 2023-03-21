import httpStatus from 'http-status';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { IUserDoc, IUserWithTokens } from '@interfaces/users.interface';
import User from '@models/users.model';
import { isEmpty } from '@utils/util';
import ApiError from '@/exceptions/ApiError';
import UserService from './users.service';
import TokenService from '@/modules/token/token.service';
import { Token, tokenTypes } from '@/modules/token';
import mongoose from 'mongoose';
import { HttpException } from '@/exceptions/HttpException';

class AuthService {
  public users = User;
  public userService = new UserService();
  public tokenService = new TokenService();

  public signup = async (userData: CreateUserDto): Promise<IUserDoc> => {
    if (isEmpty(userData)) throw new HttpException(400, 1001, 'required fields cannot be empty');

    const findUser: IUserDoc | null = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(400, 1002, `email ${userData.email} already exists`);

    const createUserData: IUserDoc = await this.users.create(userData);

    return createUserData;
  };

  public loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUserDoc> => {
    const user = await this.userService.findUserByEmail(email);

    if (!user || !(await user.isPasswordMatch(password))) {
      throw new HttpException(400, 1003, 'Incorrect email or password');
    }
    return user;
  };

  public async logout(refreshToken: string): Promise<void> {
    const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
      throw new HttpException(400, 1004, 'Not found');
    }
    await refreshTokenDoc.remove();
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

  public resetPassword = async (resetPasswordToken: any, newPassword: string): Promise<IUserDoc> => {
    const resetPasswordTokenDoc = await this.tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await this.userService.findUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new HttpException(400, 1005, 'Invalid reset password token');
    }
    const updatedUser = await this.userService.updateUser(user._id, { password: newPassword });
    await Token.deleteMany({ user: user._id, type: tokenTypes.RESET_PASSWORD });
    return updatedUser;
  };

  public verifyEmail = async (verifyEmailToken: any): Promise<IUserDoc | null> => {
    const verifyEmailTokenDoc = await this.tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await this.userService.findUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new HttpException(400, 1006, 'Invalid verification token');
    }
    await Token.deleteMany({ user: user._id, type: tokenTypes.VERIFY_EMAIL });
    const updatedUser = await this.userService.updateUser(user._id, { verified: true });
    return updatedUser;
  };

  public refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
    try {
      const refreshTokenDoc = await this.tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
      const user: any = await this.userService.findUserById(new mongoose.Types.ObjectId(refreshTokenDoc.user));
      if (!user) {
        throw new HttpException(400, 1005, 'cannot find user');
      }
      await refreshTokenDoc.remove();
      const tokens = await this.tokenService.generateAuthTokens(user);
      return { user, tokens };
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
  };
}

export default AuthService;
