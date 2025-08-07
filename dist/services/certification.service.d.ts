import UserService from './users.service';
import mongoose from 'mongoose';
import { ICertification, IUpdateCertification } from '../interfaces/profile.interface';
declare class CertificationService {
    userService: UserService;
    certification: any;
    createCertification(body: ICertification): Promise<any>;
    getUserCertification(userId: mongoose.Types.ObjectId | string): Promise<any>;
    getCertificationById(id: mongoose.Types.ObjectId | string): Promise<any>;
    updateCertificationById(id: mongoose.Types.ObjectId | string, body: IUpdateCertification): Promise<any>;
    deleteCertification(id: mongoose.Types.ObjectId | string): Promise<any>;
}
export default CertificationService;
