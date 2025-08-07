import UserService from './users.service';
import mongoose from 'mongoose';
import { IBillingAddress, IUpdateBio } from '../interfaces/profile.interface';
declare class BankService {
    bank: any;
    userService: UserService;
    addBankInfo(body: IBillingAddress): Promise<any>;
    getUserBank(userId: mongoose.Types.ObjectId | string): Promise<any>;
    getBankById(id: mongoose.Types.ObjectId | string): Promise<any>;
    updateBankInfo(id: mongoose.Types.ObjectId | string, body: IUpdateBio): Promise<any>;
    deleteBank(id: mongoose.Types.ObjectId | string): Promise<any>;
}
export default BankService;
