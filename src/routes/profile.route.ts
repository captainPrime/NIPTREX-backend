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
import BioController from '@/controllers/bio.controller';
import JobController from '@/controllers/job.controller';
import BankController from '@/controllers/bank.controller';

class ProfileRoute implements Routes {
  public path = '/profile';
  public router = Router();
  public bioController = new BioController();
  public jobController = new JobController();
  public bankController = new BankController();
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
    this.router.get(`${this.path}`, authMiddleware(['freelancer', 'client']), this.profileController.getProfile);
    this.router.get(`${this.path}/getProfileByUserId`, this.profileController.getProfileByUserId);
    /*
    |--------------------------------------------------------------------------
    | Experience Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/experience`, authMiddleware(['freelancer', 'client']), this.profileController.createExperience);
    this.router.get(`${this.path}/experience`, authMiddleware(['freelancer', 'client']), this.profileController.getUserExperience);
    this.router.put(`${this.path}/experience/:id`, authMiddleware(['freelancer', 'client']), this.profileController.updateExperience);
    this.router.delete(`${this.path}/experience/:id`, authMiddleware(['freelancer', 'client']), this.profileController.deleteExperience);
    this.router.get(`${this.path}/experience/:id`, authMiddleware(['freelancer', 'client']), this.profileController.getExperienceById);

    /*
    |--------------------------------------------------------------------------
    | Education Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/education`, authMiddleware(['freelancer', 'client']), this.educationController.createEducation);
    this.router.get(`${this.path}/education`, authMiddleware(['freelancer', 'client']), this.educationController.getUserEducation);
    this.router.put(`${this.path}/education/:id`, authMiddleware(['freelancer', 'client']), this.educationController.updateEducation);
    this.router.delete(`${this.path}/education/:id`, authMiddleware(['freelancer', 'client']), this.educationController.deleteEducation);
    this.router.get(`${this.path}/education/:id`, authMiddleware(['freelancer', 'client']), this.educationController.getEducationById);

    /*
    |--------------------------------------------------------------------------
    | Certification Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/certificate`, authMiddleware(['freelancer', 'client']), this.certificationController.createCertification);
    this.router.get(`${this.path}/certificate`, authMiddleware(['freelancer', 'client']), this.certificationController.getUserCertification);
    this.router.put(`${this.path}/certificate/:id`, authMiddleware(['freelancer', 'client']), this.certificationController.updateCertification);
    this.router.delete(`${this.path}/certificate/:id`, authMiddleware(['freelancer', 'client']), this.certificationController.deleteCertification);
    this.router.get(`${this.path}/certificate/:id`, authMiddleware(['freelancer', 'client']), this.certificationController.getCertificationById);

    /*
    |--------------------------------------------------------------------------
    | Billing Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/billing`, authMiddleware(['freelancer', 'client']), this.billingController.createBilling);
    this.router.get(`${this.path}/billing`, authMiddleware(['freelancer', 'client']), this.billingController.getUserBilling);
    this.router.put(`${this.path}/billing`, authMiddleware(['freelancer', 'client']), this.billingController.updateBilling);
    this.router.delete(`${this.path}/billing/:id`, authMiddleware(['freelancer', 'client']), this.billingController.deleteBilling);
    this.router.get(`${this.path}/billing/:id`, authMiddleware(['freelancer', 'client']), this.billingController.getBillingById);

    /*
    |--------------------------------------------------------------------------
    | Identity Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/identity`, authMiddleware(['freelancer', 'client']), this.identityController.createIdentity);
    this.router.get(`${this.path}/identity`, authMiddleware(['freelancer', 'client']), this.identityController.getUserIdentity);
    this.router.put(`${this.path}/identity`, authMiddleware(['freelancer', 'client']), this.identityController.updateIdentity);
    this.router.delete(`${this.path}/identity/:id`, authMiddleware(['freelancer', 'client']), this.identityController.deleteIdentity);
    this.router.get(`${this.path}/identity/:id`, authMiddleware(['freelancer', 'client']), this.identityController.getIdentityById);

    /*
    |--------------------------------------------------------------------------
    | Work Preference Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/preference`, authMiddleware(['freelancer', 'client']), this.preferenceController.createPreference);
    this.router.get(`${this.path}/preference`, authMiddleware(['freelancer', 'client']), this.preferenceController.getUserPreference);
    this.router.put(`${this.path}/preference`, authMiddleware(['freelancer', 'client']), this.preferenceController.updatePreference);
    this.router.delete(`${this.path}/preference/:id`, authMiddleware(['freelancer', 'client']), this.preferenceController.deletePreference);
    this.router.get(`${this.path}/preference/:id`, authMiddleware(['freelancer', 'client']), this.preferenceController.getPreferenceById);

    /*
    |--------------------------------------------------------------------------
    | About Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/about`, authMiddleware(['freelancer', 'client']), this.aboutController.createAbout);
    this.router.get(`${this.path}/about`, authMiddleware(['freelancer', 'client']), this.aboutController.getUserAbout);
    this.router.put(`${this.path}/about`, authMiddleware(['freelancer', 'client']), this.aboutController.updateAbout);
    this.router.delete(`${this.path}/about/:id`, authMiddleware(['freelancer', 'client']), this.aboutController.deleteAbout);
    this.router.put(`${this.path}/resume/:id`, authMiddleware(['freelancer', 'client']), this.aboutController.updateResumeById);
    this.router.delete(`${this.path}/resume/:id`, authMiddleware(['freelancer', 'client']), this.aboutController.deleteResumeById);
    this.router.get(`${this.path}/about/:id`, authMiddleware(['freelancer', 'client']), this.aboutController.getAboutById);

    /*
    |--------------------------------------------------------------------------
    | Bio Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/bio`, authMiddleware(['freelancer', 'client']), this.bioController.createBio);
    this.router.get(`${this.path}/bio`, authMiddleware(['freelancer', 'client']), this.bioController.getUserBio);
    this.router.put(`${this.path}/bio`, authMiddleware(['freelancer', 'client']), this.bioController.updateBio);
    this.router.delete(`${this.path}/bio/:id`, authMiddleware(['freelancer', 'client']), this.bioController.deleteBio);
    this.router.get(`${this.path}/bio/:id`, authMiddleware(['freelancer', 'client']), this.bioController.getBioById);

    /*
    |--------------------------------------------------------------------------
    | Bank Route
    |--------------------------------------------------------------------------
    */
    this.router.post(`${this.path}/billingAddress`, authMiddleware(['freelancer', 'client']), this.bankController.createBank);
    this.router.get(`${this.path}/billingAddress`, authMiddleware(['freelancer', 'client']), this.bankController.getUserBank);
    this.router.put(`${this.path}/billingAddress`, authMiddleware(['freelancer', 'client']), this.bankController.updateBankInfo);
    this.router.delete(`${this.path}/billingAddress/:id`, authMiddleware(['freelancer', 'client']), this.bankController.deleteBankInfo);
    this.router.get(`${this.path}/billingAddress/:id`, authMiddleware(['freelancer', 'client']), this.bankController.getBankById);

    /*
    |--------------------------------------------------------------------------
    | Bio Route
    |--------------------------------------------------------------------------
    */
    this.router.get(`${this.path}/freelanceWorkHistory`, authMiddleware(['freelancer', 'client']), this.jobController.freelanceWorkHistory);
  }
}

export default ProfileRoute;
