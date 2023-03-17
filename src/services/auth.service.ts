import { hash } from 'bcryptjs';
import httpStatus from 'http-status';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { IUserDoc, IUserWithTokens } from '@interfaces/users.interface';
import User from '@models/users.model';
import { isEmpty } from '@utils/util';
import ApiError from '@/exceptions/ApiError';
import UserService from './users.service';
import TokenService from '@/modules/token/token.service';
import { Token, tokenTypes } from '@/modules/token';
import mongoose from 'mongoose';

class AuthService {
  public users = User;
  public userService = new UserService();
  public tokenService = new TokenService();

  public async signup(userData: CreateUserDto): Promise<IUserDoc> {
    if (isEmpty(userData)) throw new ApiError(400, "You're not userData");

    const findUser: IUserDoc | null = await this.users.findOne({ email: userData.email });
    if (findUser) throw new ApiError(409, `email ${userData.email} already exists`);

    const createUserData: IUserDoc = await this.users.create(userData);

    return createUserData;
  }

  public loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUserDoc> => {
    const user = await this.userService.findUserByEmail(email);

    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
  };

  public async logout(refreshToken: string): Promise<void> {
    const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
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

  public resetPassword = async (resetPasswordToken: any, newPassword: string): Promise<void> => {
    try {
      const resetPasswordTokenDoc = await this.tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
      const user = await this.userService.findUserById(new mongoose.Types.ObjectId(resetPasswordTokenDoc.user));
      if (!user) {
        throw new Error();
      }
      await this.userService.updateUser(user._id, { password: newPassword });
      await Token.deleteMany({ user: user._id, type: tokenTypes.RESET_PASSWORD });
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
  };

  public verifyEmail = async (verifyEmailToken: any): Promise<IUserDoc | null> => {
    const verifyEmailTokenDoc = await this.tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await this.userService.findUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user._id, type: tokenTypes.VERIFY_EMAIL });
    const updatedUser = await this.userService.updateUser(user._id, { isEmailVerified: true });
    return updatedUser;
  };

  public refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
    try {
      const refreshTokenDoc = await this.tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
      const user: any = await this.userService.findUserById(new mongoose.Types.ObjectId(refreshTokenDoc.user));
      if (!user) {
        throw new Error();
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
