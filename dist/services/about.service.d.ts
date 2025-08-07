import UserService from './users.service';
import mongoose from 'mongoose';
import { IAbout, IUpdateAbout } from '@/interfaces/profile.interface';
declare class AboutService {
    about: any;
    userService: UserService;
    createAbout(body: IAbout): Promise<any>;
    getUserAbout(userId: mongoose.Types.ObjectId | string): Promise<any>;
    getAboutById(id: mongoose.Types.ObjectId | string): Promise<any>;
    updateAboutById(id: mongoose.Types.ObjectId | string, body: IUpdateAbout): Promise<any>;
    updateResumeById(id: mongoose.Types.ObjectId | string, body: {
        name: string;
        url: string;
    }, resumeId: string): Promise<any>;
    deleteResumeById(id: mongoose.Types.ObjectId | string, resumeId: string): Promise<any>;
    deleteAbout(id: mongoose.Types.ObjectId | string): Promise<any>;
}
export default AboutService;
