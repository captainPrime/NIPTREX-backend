import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';

export default class ErrorMiddleware {
  static handleError = () => {
    return async (error: HttpException, req: Request, res: Response, next: NextFunction) => {
      try {
        const status: number = error.status || 400;
        const response_code: number = error.responseCode || 400;
        const message: string = error.message || 'Something went wrong';
        const data: any[] = error.data || [];

        logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
        res.status(200).json({ status, response_code, message, data });
      } catch (error) {
        next(error);
      }
    };
  };

  static initializeUnhandledException = () => {
    process.on('unhandledRejection', (reason: Error) => {
      logger.error(`[${reason.name}] >> ${reason.message}`);
      logger.info('UNHANDLED REJECTION! 💥 Shutting down...');
      throw reason;
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error(`[${error.name}] >> ${error.message}`);
      logger.info('UNCAUGHT EXCEPTION! 💥 Shutting down...');
      process.exit(1);
    });
  };
}
