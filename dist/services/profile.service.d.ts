import mongoose from 'mongoose';
import UserService from './users.service';
import { IEducationHistory, IExperience, IUpdateEducationHistory, IUpdateExperience } from '../interfaces/profile.interface';
declare class ProfileService {
    bio: any;
    about: any;
    bank: any;
    billing: any;
    identity: any;
    education: any;
    experience: any;
    preference: any;
    certification: any;
    userService: UserService;
    getProfile(userId: string): Promise<any>;
    getDirectProfile(userId: string): Promise<any>;
    createExperience(body: IExperience): Promise<any>;
    getUserExperience(userId: mongoose.Types.ObjectId | string): Promise<any>;
    getExperienceById(id: mongoose.Types.ObjectId | string): Promise<any>;
    updateExperienceById(id: mongoose.Types.ObjectId | string, body: IUpdateExperience): Promise<any>;
    deleteExperience(id: mongoose.Types.ObjectId | string): Promise<any>;
    createEducation(body: IEducationHistory): Promise<any>;
    getUserEducation(userId: mongoose.Types.ObjectId | string): Promise<any>;
    getEducationById(id: mongoose.Types.ObjectId | string): Promise<any>;
    updateEducationById(id: mongoose.Types.ObjectId | string, body: IUpdateEducationHistory): Promise<any>;
    deleteEducation(id: mongoose.Types.ObjectId | string): Promise<any>;
}
export default ProfileService;
