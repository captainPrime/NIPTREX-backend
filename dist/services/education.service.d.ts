import UserService from './users.service';
import mongoose from 'mongoose';
import { IEducationHistory, IUpdateEducationHistory } from '@/interfaces/profile.interface';
declare class EducationService {
    education: any;
    userService: UserService;
    createEducation(body: IEducationHistory): Promise<any>;
    getUserEducation(userId: mongoose.Types.ObjectId | string): Promise<any>;
    getEducationById(id: mongoose.Types.ObjectId | string): Promise<any>;
    updateEducationById(id: string | mongoose.Types.ObjectId, body: IUpdateEducationHistory): Promise<any>;
    deleteEducation(id: mongoose.Types.ObjectId | string): Promise<any>;
}
export default EducationService;
