import { Moment } from 'moment';
import mongoose from 'mongoose';
import { AccessAndRefreshTokens, ITokenDoc } from './token.interfaces';
import UserService from '../../services/users.service';
import { IUserDoc } from '../../interfaces/users.interface';
declare class TokenService {
    secret: string | undefined;
    userService: UserService;
    generateToken(userId: mongoose.Types.ObjectId, expires: Moment, type: string): string;
    saveToken(token: string, userId: mongoose.Types.ObjectId, expires: Moment, type: string, blacklisted?: boolean): Promise<ITokenDoc>;
    verifyToken(token: string, type: string): Promise<ITokenDoc>;
    generateAuthTokens(user: IUserDoc): Promise<AccessAndRefreshTokens>;
    generateResetPasswordToken(email: string): Promise<string>;
    generateVerifyEmailToken(userId: mongoose.Types.ObjectId): Promise<string>;
}
export default TokenService;
