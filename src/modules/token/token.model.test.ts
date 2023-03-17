import moment from 'moment';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { NewToken } from './token.interfaces';
import tokenTypes from './token.types';
import Token from './token.model';
import { JWT_ACCESS_EXPIRATION_MINUTES, JWT_REFRESH_EXPIRATION_DAYS } from '@/config';
import TokenService from './token.service';

class TokenModelTest {
  password = 'password1';
  public tokenService = new TokenService();
  accessTokenExpires = moment().add(JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');

  userOne = {
    _id: new mongoose.Types.ObjectId(),
    name: faker.name.findName(),
    email: faker.internet.email().toLowerCase(),
    password: this.password,
    role: 'user',
    verified: false,
  };

  userOneAccessToken = this.tokenService.generateToken(this.userOne._id, this.accessTokenExpires, tokenTypes.ACCESS);

  refreshTokenExpires = moment().add(JWT_REFRESH_EXPIRATION_DAYS, 'days');

  newToken: NewToken = {
    token: this.userOneAccessToken,
    user: this.userOne._id.toHexString(),
    type: tokenTypes.REFRESH,
    expires: this.refreshTokenExpires.toDate(),
  };

  testValidToken = async () => {
    await expect(new Token(this.newToken).validate()).resolves.toBeUndefined();
  };

  testInvalidTypeToken = async () => {
    this.newToken.type = 'invalidType';
    await expect(new Token(this.newToken).validate()).rejects.toThrow();
  };
}

describe('Token Model', () => {
  const tokenModelTest = new TokenModelTest();

  test('should correctly validate a valid token', tokenModelTest.testValidToken);

  test('should throw a validation error if type is unknown', tokenModelTest.testInvalidTypeToken);
});
