import { ClassConstructor } from 'class-transformer';
import { RequestHandler } from 'express';
export declare class CreateUserRequest {
    userName: string;
}
export default class RequestValidator {
    static validate: <T extends object>(classInstance: ClassConstructor<T>, skipMissingProperties?: boolean, whitelist?: boolean, forbidNonWhitelisted?: boolean) => RequestHandler;
}
