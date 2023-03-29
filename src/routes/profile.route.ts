import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import AboutController from '@/controllers/about.controller';
import ProfileController from '@/controllers/profile.controller';
import BillingController from '@/controllers/billing.controller';
import IdentityController from '@/controllers/identity.controller';
import EducationController from '@/controllers/education.controller';
import PreferenceController from '@/controllers/preference.controller';
import CertificationController from '@/controllers/certification.controller';

class ProfileRoute implements Routes {
  public path = '/profile';
  public router = Router();
  public aboutController = new AboutController();
  public billingController = new BillingController();
  public profileController = new ProfileController();
  public identityController = new IdentityController();
  public educationController = new EducationController();
  public preferenceController = new PreferenceController();
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

    /*
    |--------------------------------------------------------------------------
    | Identity Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/identity`, authMiddleware, this.identityController.createIdentity);
    this.router.get(`${this.path}/identity`, authMiddleware, this.identityController.getUserIdentity);
    this.router.put(`${this.path}/identity/:id`, authMiddleware, this.identityController.updateIdentity);
    this.router.delete(`${this.path}/identity/:id`, authMiddleware, this.identityController.deleteIdentity);
    this.router.get(`${this.path}/identity/:id`, authMiddleware, this.identityController.getIdentityById);

    /*
    |--------------------------------------------------------------------------
    | Work Preference Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/preference`, authMiddleware, this.preferenceController.createPreference);
    this.router.get(`${this.path}/preference`, authMiddleware, this.preferenceController.getUserPreference);
    this.router.put(`${this.path}/preference/:id`, authMiddleware, this.preferenceController.updatePreference);
    this.router.delete(`${this.path}/preference/:id`, authMiddleware, this.preferenceController.deletePreference);
    this.router.get(`${this.path}/preference/:id`, authMiddleware, this.preferenceController.getPreferenceById);

    /*
    |--------------------------------------------------------------------------
    | About Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/about`, authMiddleware, this.aboutController.createAbout);
    this.router.get(`${this.path}/about`, authMiddleware, this.aboutController.getUserAbout);
    this.router.put(`${this.path}/about/:id`, authMiddleware, this.aboutController.updateAbout);
    this.router.delete(`${this.path}/about/:id`, authMiddleware, this.aboutController.deleteAbout);
    this.router.get(`${this.path}/about/:id`, authMiddleware, this.aboutController.getAboutById);
  }
}

export default ProfileRoute;
