import { Request, Response, NextFunction } from 'express';
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const asyncWrapper: (handler: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => void;
export {};
