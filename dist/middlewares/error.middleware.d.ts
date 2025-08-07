import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/HttpException';
export default class ErrorMiddleware {
    static handleError: () => (error: HttpException, req: Request, res: Response, next: NextFunction) => Promise<void>;
    static initializeUnhandledException: () => void;
}
