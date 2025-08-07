import UserService from './users.service';
import mongoose from 'mongoose';
import { IDocument, IUpdateDocument } from '@/interfaces/profile.interface';
declare class IdentityService {
    identity: any;
    userService: UserService;
    createIdentity(body: IDocument): Promise<any>;
    getUserIdentity(userId: mongoose.Types.ObjectId | string): Promise<any>;
    getIdentityById(id: mongoose.Types.ObjectId | string): Promise<any>;
    updateIdentityById(id: mongoose.Types.ObjectId | string, body: IUpdateDocument): Promise<any>;
    deleteIdentity(id: mongoose.Types.ObjectId | string): Promise<any>;
}
export default IdentityService;
