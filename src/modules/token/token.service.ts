import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Token from './token.model';
import tokenTypes from './token.types';
import { AccessAndRefreshTokens, ITokenDoc } from './token.interfaces';
import ApiError from '@/exceptions/ApiError';
import UserService from '@/services/users.service';
import { IUserDoc } from '@/interfaces/users.interface';
import {
  JWT_ACCESS_EXPIRATION_MINUTES,
  JWT_REFRESH_EXPIRATION_DAYS,
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  SECRET_KEY,
} from '@/config';

class TokenService {
  secret: string | undefined;
  public userService = new UserService();

  generateToken(userId: mongoose.Types.ObjectId, expires: Moment, type: string): string {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, SECRET_KEY as string);
  }

  async saveToken(token: string, userId: mongoose.Types.ObjectId, expires: Moment, type: string, blacklisted = false): Promise<ITokenDoc> {
    const tokenDoc = await Token.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type,
      blacklisted,
    });
    return tokenDoc;
  }

  async verifyToken(token: string, type: string): Promise<ITokenDoc> {
    const payload = jwt.verify(token, SECRET_KEY as string);
    if (typeof payload.sub !== 'string') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'bad user');
    }
    const tokenDoc = await Token.findOne({
      token,
      type,
      user: payload.sub,
      blacklisted: false,
    });
    if (!tokenDoc) {
      throw new Error('Token not found');
    }
    return tokenDoc;
  }

  async generateAuthTokens(user: IUserDoc): Promise<AccessAndRefreshTokens> {
    const accessTokenExpires = moment().add(JWT_ACCESS_EXPIRATION_MINUTES, 'days');
    const accessToken = this.generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(JWT_REFRESH_EXPIRATION_DAYS, 'days');
    const refreshToken = this.generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
    await this.saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  }

  async generateResetPasswordToken(email: string): Promise<string> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new ApiError(httpStatus.NO_CONTENT, '');
    }
    const expires = moment().add(JWT_RESET_PASSWORD_EXPIRATION_MINUTES, 'minutes');
    const resetPasswordToken = this.generateToken(user._id, expires, tokenTypes.RESET_PASSWORD);
    await this.saveToken(resetPasswordToken, user._id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
  }

  async generateVerifyEmailToken(userId: mongoose.Types.ObjectId): Promise<string> {
    const expires = moment().add(JWT_VERIFY_EMAIL_EXPIRATION_MINUTES, 'minutes');
    const verifyEmailToken = this.generateToken(userId, expires, tokenTypes.VERIFY_EMAIL);
    await this.saveToken(verifyEmailToken, userId, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
  }
}

export default TokenService;
