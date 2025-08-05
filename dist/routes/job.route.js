"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const job_controller_1 = tslib_1.__importDefault(require("../controllers/job.controller"));
const auth_middleware_1 = tslib_1.__importDefault(require("../middlewares/auth.middleware"));
class JobRoute {
    constructor() {
        this.path = '/job';
        this.router = (0, express_1.Router)();
        this.jobController = new job_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/getAllJobs`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.jobController.getAllJobs);
        this.router.post(`${this.path}`, (0, auth_middleware_1.default)(['client']), this.jobController.createJob);
        this.router.put(`${this.path}/update/:id`, (0, auth_middleware_1.default)(['client']), this.jobController.updateJob);
        this.router.get(`${this.path}/mostRecents`, (0, auth_middleware_1.default)(['freelancer']), this.jobController.getMostRecentJobs);
        this.router.get(`${this.path}/getUserJobBestMatches`, (0, auth_middleware_1.default)(['freelancer']), this.jobController.getUserJobBestMatches);
        this.router.get(`${this.path}/getSimilarJobs/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.jobController.getSimilarJobs);
        this.router.get(`${this.path}/getFeaturedJobs`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.jobController.getFeaturedJobs);
        this.router.get(`${this.path}/getFreelancerContracts`, (0, auth_middleware_1.default)(['freelancer']), this.jobController.getFreelancerContracts);
        this.router.get(`${this.path}/getFreelancerContracts/:id`, (0, auth_middleware_1.default)(['freelancer']), this.jobController.getFreelancerContractsById);
        this.router.get(`${this.path}/getFreelancerContracts/:freelancer_id/:proposal_id`, (0, auth_middleware_1.default)(['client']), this.jobController.getFreelancerContractsByIdClient);
        this.router.get(`${this.path}/skills`, this.jobController.getAllSkills);
        this.router.get(`${this.path}/technicalTools`, this.jobController.technicalTools);
        this.router.get(`${this.path}/softSkills`, this.jobController.getAllSoftSkills);
        this.router.get(`${this.path}/skillsCategory`, this.jobController.getAllSkillsCategory);
        this.router.get(`${this.path}/savedJobs`, (0, auth_middleware_1.default)(['freelancer']), this.jobController.getUserSavedJobs);
        this.router.get(`${this.path}/getUserSavedItems`, (0, auth_middleware_1.default)(['freelancer']), this.jobController.getUserSavedItems);
        this.router.get(`${this.path}/client/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.jobController.getJobByClientId);
        this.router.get(`${this.path}/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.jobController.getJobById);
        this.router.post(`${this.path}/saveJob/:id`, (0, auth_middleware_1.default)(['freelancer']), this.jobController.savedJob);
        this.router.post(`${this.path}/unSaveJob/:id`, (0, auth_middleware_1.default)(['freelancer']), this.jobController.unSaveJob);
    }
}
exports.default = JobRoute;
//# sourceMappingURL=job.route.js.map