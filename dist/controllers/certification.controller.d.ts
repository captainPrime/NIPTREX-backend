import { NextFunction, Request, Response } from 'express';
import UserService from '@/services/users.service';
import CertificationService from '@/services/certification.service';
declare class CertificationController {
    userService: UserService;
    certificationService: CertificationService;
    createCertification: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserCertification: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCertificationById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateCertification: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteCertification: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default CertificationController;
