import { CreateUserDto } from '@dtos/users.dto';
import { IUserDoc, IUserModel, UpdateUserBody } from '@interfaces/users.interface';
import mongoose from 'mongoose';
declare class UserService {
    users: IUserModel;
    about: any;
    findAllUser(): Promise<IUserModel[]>;
    findAllFreelancer(query: any): Promise<any[]>;
    findUserById(userId: mongoose.Types.ObjectId | string): Promise<any>;
    findUserByIds(userIds: string[]): Promise<any[]>;
    findUserByEmail(email: string): Promise<IUserDoc | null>;
    findUserByReferralCode(referral_code: string): Promise<IUserDoc | null>;
    createUser(userData: CreateUserDto): Promise<IUserModel>;
    updateUser(userId: mongoose.Types.ObjectId | string, userData: UpdateUserBody): Promise<IUserDoc>;
    deleteUser(userId: mongoose.Types.ObjectId | string): Promise<IUserModel>;
}
export default UserService;
