import UserService from './users.service';
import mongoose from 'mongoose';
import { IConfig, IUpdateConfig } from '@/models/config.model';
declare class ConfigService {
    config: any;
    userService: UserService;
    createConfig(body: IConfig): Promise<any>;
    getAllConfig(): Promise<any>;
    getConfigById(id: mongoose.Types.ObjectId | string): Promise<any>;
    updateConfigById(id: mongoose.Types.ObjectId | string, body: IUpdateConfig): Promise<any>;
    deleteConfig(id: mongoose.Types.ObjectId | string): Promise<any>;
}
export default ConfigService;
