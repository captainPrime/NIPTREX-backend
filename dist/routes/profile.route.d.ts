import { Routes } from '../interfaces/routes.interface';
import AboutController from '../controllers/about.controller';
import ProfileController from '../controllers/profile.controller';
import BillingController from '../controllers/billing.controller';
import IdentityController from '../controllers/identity.controller';
import EducationController from '../controllers/education.controller';
import PreferenceController from '../controllers/preference.controller';
import CertificationController from '../controllers/certification.controller';
import BioController from '../controllers/bio.controller';
import JobController from '../controllers/job.controller';
import BankController from '../controllers/bank.controller';
declare class ProfileRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    bioController: BioController;
    jobController: JobController;
    bankController: BankController;
    aboutController: AboutController;
    billingController: BillingController;
    profileController: ProfileController;
    identityController: IdentityController;
    educationController: EducationController;
    preferenceController: PreferenceController;
    certificationController: CertificationController;
    constructor();
    private initializeRoutes;
}
export default ProfileRoute;
