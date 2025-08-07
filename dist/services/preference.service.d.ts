import UserService from './users.service';
import mongoose from 'mongoose';
import { IPreferences, IUpdatePreference } from '../interfaces/profile.interface';
declare class PreferenceService {
    preference: any;
    userService: UserService;
    createPreference(body: IPreferences): Promise<any>;
    getUserPreference(userId: mongoose.Types.ObjectId | string): Promise<any>;
    getPreferenceById(id: mongoose.Types.ObjectId | string): Promise<any>;
    updatePreferenceById(id: mongoose.Types.ObjectId | string, body: IUpdatePreference): Promise<any>;
    deletePreference(id: mongoose.Types.ObjectId | string): Promise<any>;
}
export default PreferenceService;
