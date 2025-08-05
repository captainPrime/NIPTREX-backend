"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPaymentMethod = exports.UserStatus = exports.WorkOption = exports.JobDuration = exports.WorkSchedule = exports.TeamSize = exports.JobTitle = exports.EmploymentType = void 0;
var EmploymentType;
(function (EmploymentType) {
    EmploymentType["FullTime"] = "Full Time";
    EmploymentType["PartTime"] = "Part Time";
    EmploymentType["Contract"] = "Contract";
    EmploymentType["Freelance"] = "Freelance";
    EmploymentType["Internship"] = "Internship";
    EmploymentType["Volunteer"] = "Volunteer";
})(EmploymentType = exports.EmploymentType || (exports.EmploymentType = {}));
var JobTitle;
(function (JobTitle) {
    JobTitle[JobTitle["Artificial Intelligence Engineer"] = 0] = "Artificial Intelligence Engineer";
    JobTitle[JobTitle["Business Analyst"] = 1] = "Business Analyst";
    JobTitle[JobTitle["Cloud Architect"] = 2] = "Cloud Architect";
    JobTitle[JobTitle["Cybersecurity Analyst"] = 3] = "Cybersecurity Analyst";
    JobTitle[JobTitle["Data Analyst"] = 4] = "Data Analyst";
    JobTitle[JobTitle["Data Scientist"] = 5] = "Data Scientist";
    JobTitle[JobTitle["Full-stack Developer"] = 6] = "Full-stack Developer";
    JobTitle[JobTitle["Game Developer"] = 7] = "Game Developer";
    JobTitle[JobTitle["Information Security Analyst"] = 8] = "Information Security Analyst";
    JobTitle[JobTitle["IT Manager"] = 9] = "IT Manager";
    JobTitle[JobTitle["Java Developer"] = 10] = "Java Developer";
    JobTitle[JobTitle["Machine Learning Engineer"] = 11] = "Machine Learning Engineer";
    JobTitle[JobTitle["Mobile Application Developer"] = 12] = "Mobile Application Developer";
    JobTitle[JobTitle["Network Administrator"] = 13] = "Network Administrator";
    JobTitle[JobTitle["Network Architect"] = 14] = "Network Architect";
    JobTitle[JobTitle["Project Manager"] = 15] = "Project Manager";
    JobTitle[JobTitle["Quality Assurance Analyst"] = 16] = "Quality Assurance Analyst";
    JobTitle[JobTitle["Robotics Engineer"] = 17] = "Robotics Engineer";
    JobTitle[JobTitle["Software Developer"] = 18] = "Software Developer";
    JobTitle[JobTitle["Software Engineer"] = 19] = "Software Engineer";
    JobTitle[JobTitle["System Administrator"] = 20] = "System Administrator";
    JobTitle[JobTitle["UI/UX Designer"] = 21] = "UI/UX Designer";
    JobTitle[JobTitle["Web Developer"] = 22] = "Web Developer";
})(JobTitle = exports.JobTitle || (exports.JobTitle = {}));
var TeamSize;
(function (TeamSize) {
    TeamSize[TeamSize["Small team (4-6 members)"] = 0] = "Small team (4-6 members)";
    TeamSize[TeamSize["Large team (9-10 members)"] = 1] = "Large team (9-10 members)";
    TeamSize[TeamSize["X-Large team (11-16 members)"] = 2] = "X-Large team (11-16 members)";
})(TeamSize = exports.TeamSize || (exports.TeamSize = {}));
var WorkSchedule;
(function (WorkSchedule) {
    WorkSchedule[WorkSchedule["Full time - Weekdays"] = 0] = "Full time - Weekdays";
    WorkSchedule[WorkSchedule["Weekdays (AM)"] = 1] = "Weekdays (AM)";
    WorkSchedule[WorkSchedule["Weekdays (PM)"] = 2] = "Weekdays (PM)";
    WorkSchedule[WorkSchedule["Weekends"] = 3] = "Weekends";
})(WorkSchedule = exports.WorkSchedule || (exports.WorkSchedule = {}));
var JobDuration;
(function (JobDuration) {
    JobDuration[JobDuration["Mid-term (<6 months)"] = 0] = "Mid-term (<6 months)";
    JobDuration[JobDuration["Mid-term (6-12 months)"] = 1] = "Mid-term (6-12 months)";
    JobDuration[JobDuration["Long-term (12 months or longer)"] = 2] = "Long-term (12 months or longer)";
})(JobDuration = exports.JobDuration || (exports.JobDuration = {}));
var WorkOption;
(function (WorkOption) {
    WorkOption["Remote"] = "Remote";
    WorkOption["Hybrid"] = "Hybrid";
    WorkOption["OnSite"] = "Onsite";
    WorkOption["Freelance"] = "Freelance";
})(WorkOption = exports.WorkOption || (exports.WorkOption = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
var EPaymentMethod;
(function (EPaymentMethod) {
    EPaymentMethod["NGN"] = "NGN";
    EPaymentMethod["USD"] = "USD";
})(EPaymentMethod = exports.EPaymentMethod || (exports.EPaymentMethod = {}));
//# sourceMappingURL=profile.interface.js.map