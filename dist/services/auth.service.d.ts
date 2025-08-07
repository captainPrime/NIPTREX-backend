import { CreateUserDto } from '../dtos/users.dto';
import { TokenData } from '../interfaces/auth.interface';
import { IUserDoc, IUserWithTokens } from '../interfaces/users.interface';
import UserService from './users.service';
import TokenService from '../modules/token/token.service';
declare class AuthService {
    users: import("../interfaces/users.interface").IUserModel;
    userService: UserService;
    tokenService: TokenService;
    signup: (userData: CreateUserDto) => Promise<IUserDoc>;
    loginUserWithEmailAndPassword: (email: string, password: string) => Promise<IUserDoc>;
    logout(refreshToken: string): Promise<void>;
    createToken(user: IUserDoc): TokenData;
    createCookie(tokenData: TokenData): string;
    resetPassword: (resetPasswordToken: any, newPassword: string) => Promise<IUserDoc>;
    verifyEmail: (verifyEmailToken: any) => Promise<IUserDoc | null>;
    refreshAuth: (refreshToken: string) => Promise<IUserWithTokens>;
}
export default AuthService;
