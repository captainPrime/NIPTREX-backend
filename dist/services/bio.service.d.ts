import UserService from './users.service';
import mongoose from 'mongoose';
import { IBio, IUpdateBio } from '@/interfaces/profile.interface';
declare class BioService {
    bio: any;
    userService: UserService;
    createBio(body: IBio): Promise<any>;
    getUserBio(userId: mongoose.Types.ObjectId | string): Promise<any>;
    getBioById(id: mongoose.Types.ObjectId | string): Promise<any>;
    updateBioById(id: mongoose.Types.ObjectId | string, body: IUpdateBio): Promise<any>;
    deleteBio(id: mongoose.Types.ObjectId | string): Promise<any>;
}
export default BioService;
