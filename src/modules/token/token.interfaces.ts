import { Document, Model } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export interface IToken {
  token: string;
  user: string;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

export type NewToken = Omit<IToken, 'blacklisted'>;

export interface ITokenModelITokenDoc extends IToken, Document {}

export type ITokenModel = Model<ITokenDoc>;

export interface IPayload extends JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  type: string;
}

export interface TokenPayload {
  token: string;
  expires: Date;
}

export interface AccessAndRefreshTokens {
  access: TokenPayload;
  refresh: TokenPayload;
}
