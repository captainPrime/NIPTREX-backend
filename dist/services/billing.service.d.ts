import UserService from './users.service';
import mongoose from 'mongoose';
import { IBilling, IUpdateBilling } from '@/interfaces/profile.interface';
declare class BillingService {
    billing: any;
    userService: UserService;
    createBilling(body: IBilling): Promise<any>;
    getUserBilling(userId: mongoose.Types.ObjectId | string): Promise<any>;
    getBillingById(id: mongoose.Types.ObjectId | string): Promise<any>;
    updateBillingById(id: mongoose.Types.ObjectId | string, body: IUpdateBilling): Promise<any>;
    deleteBilling(id: mongoose.Types.ObjectId | string): Promise<any>;
}
export default BillingService;
