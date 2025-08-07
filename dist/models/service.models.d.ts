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
/// <reference types="mongoose/types/inferschematype" />
import { Schema, Document } from 'mongoose';
interface IServiceProject {
    name: string;
    url: string;
}
interface IServicePrice {
    rate: number;
    duration: number;
    services: string[];
}
export declare enum ServiceProposalStatus {
    NULL = "null",
    PAID = "paid",
    CLOSED = "closed",
    APPLIED = "applied",
    COMPLETED = "completed",
    IN_PROGRESS = "in_progress"
}
export interface IService extends Document {
    user_id: Schema.Types.ObjectId;
    title: string;
    headline: string;
    description: string;
    rating: number;
    projects: IServiceProject[];
    services: string[];
    category: string[];
    tools: string[];
    price: {
        basic: IServicePrice;
        standard: IServicePrice;
        premium: IServicePrice;
    };
    featured: boolean;
}
export interface IServiceProposal extends Document {
    amount: number;
    delivery_date: Date;
    package_type: string;
    service_id: string;
    status: ServiceProposalStatus;
    client_id: string;
    service_buyer: string;
}
export type IUpdateService = Partial<IService>;
declare const ServiceModel: import("mongoose").Model<IService, {}, {}, {}, any>;
declare const HireServiceModel: import("mongoose").Model<unknown, unknown, unknown, {}, any>;
declare const ServiceProposalModel: import("mongoose").Model<IServiceProposal, {}, {}, {}, any>;
export { ServiceModel, HireServiceModel, ServiceProposalModel };
