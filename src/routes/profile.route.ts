import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import ProfileController from '@/controllers/profile.controller';
import EducationController from '@/controllers/education.controller';
import CertificationController from '@/controllers/certification.controller';
import BillingController from '@/controllers/billing.controller';

class ProfileRoute implements Routes {
  public path = '/profile';
  public router = Router();
  public billingController = new BillingController();
  public profileController = new ProfileController();
  public educationController = new EducationController();
  public certificationController = new CertificationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /*
    |--------------------------------------------------------------------------
    | Experience Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/experience`, authMiddleware, this.profileController.createExperience);
    this.router.get(`${this.path}/experience`, authMiddleware, this.profileController.getUserExperience);
    this.router.put(`${this.path}/experience/:id`, authMiddleware, this.profileController.updateExperience);
    this.router.delete(`${this.path}/experience/:id`, authMiddleware, this.profileController.deleteExperience);
    this.router.get(`${this.path}/experience/:id`, authMiddleware, this.profileController.getExperienceById);

    /*
    |--------------------------------------------------------------------------
    | Education Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/education`, authMiddleware, this.educationController.createEducation);
    this.router.get(`${this.path}/education`, authMiddleware, this.educationController.getUserEducation);
    this.router.put(`${this.path}/education/:id`, authMiddleware, this.educationController.updateEducation);
    this.router.delete(`${this.path}/education/:id`, authMiddleware, this.educationController.deleteEducation);
    this.router.get(`${this.path}/education/:id`, authMiddleware, this.educationController.getEducationById);

    /*
    |--------------------------------------------------------------------------
    | Certification Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/certificate`, authMiddleware, this.certificationController.createCertification);
    this.router.get(`${this.path}/certificate`, authMiddleware, this.certificationController.getUserCertification);
    this.router.put(`${this.path}/certificate/:id`, authMiddleware, this.certificationController.updateCertification);
    this.router.delete(`${this.path}/certificate/:id`, authMiddleware, this.certificationController.deleteCertification);
    this.router.get(`${this.path}/certificate/:id`, authMiddleware, this.certificationController.getCertificationById);

    /*
    |--------------------------------------------------------------------------
    | Billing Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/billing`, authMiddleware, this.billingController.createBilling);
    this.router.get(`${this.path}/billing`, authMiddleware, this.billingController.getUserBilling);
    this.router.put(`${this.path}/billing/:id`, authMiddleware, this.billingController.updateBilling);
    this.router.delete(`${this.path}/billing/:id`, authMiddleware, this.billingController.deleteBilling);
    this.router.get(`${this.path}/billing/:id`, authMiddleware, this.billingController.getBillingById);
  }
}

export default ProfileRoute;
