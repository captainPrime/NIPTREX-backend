import UserService from './users.service';
import mongoose from 'mongoose';
import { IPhotography } from '@/models/photography.model';
import { PaginationOptions } from '@/interfaces/job.inteface';
declare class PhotographyService {
    photography: any;
    userService: UserService;
    createPhotography(body: IPhotography | any): Promise<any>;
    getUserPhotography(options: PaginationOptions, filter: any): Promise<any>;
    getAllPhotography(filter: any, options: PaginationOptions): Promise<any>;
    getPhotographyById(id: mongoose.Types.ObjectId | string): Promise<any>;
    deletePhotography(id: mongoose.Types.ObjectId | string): Promise<any>;
}
export default PhotographyService;
