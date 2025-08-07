/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { IAbout, IBillingAddress, IBilling, IBio, ICertification, IDocument, IEducationHistory, IExperience, IPreferences } from '../interfaces/profile.interface';
declare const About: import("mongoose").Model<IAbout, {}, {}, {}, any>;
declare const Experience: import("mongoose").Model<IExperience, {}, {}, {}, any>;
declare const Education: import("mongoose").Model<IEducationHistory, {}, {}, {}, any>;
declare const Certification: import("mongoose").Model<ICertification, {}, {}, {}, any>;
declare const Billing: import("mongoose").Model<IBilling, {}, {}, {}, any>;
declare const Identity: import("mongoose").Model<IDocument, {}, {}, {}, any>;
declare const Preference: import("mongoose").Model<IPreferences, {}, {}, {}, any>;
declare const Bio: import("mongoose").Model<IBio, {}, {}, {}, any>;
declare const BillingAddress: import("mongoose").Model<IBillingAddress, {}, {}, {}, any>;
export { About, Experience, Education, Certification, Billing, Identity, Preference, Bio, BillingAddress };
