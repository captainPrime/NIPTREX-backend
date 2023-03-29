// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { StatusCodes } from 'http-status-codes';

export class HttpException extends Error {
  public status: number;
  public responseCode: number;
  public message: string;
  public data: any[];

  constructor(status: number, responseCode: number, message: string, data: any = []) {
    super(message);
    this.status = status;
    this.responseCode = responseCode;
    this.message = message;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends HttpException {
  constructor(path: string) {
    super(StatusCodes.NOT_FOUND, 1000, `The requested path ${path} not found!`);
  }
}

export class BadRequestError extends HttpException {
  constructor(message: string, errors: string[]) {
    super(StatusCodes.BAD_REQUEST, 1023, message, errors);
  }
}

export class ApplicationError extends HttpException {
  constructor(message: string, errors?: string[]) {
    super(StatusCodes.INTERNAL_SERVER_ERROR, 1032, message, errors);
  }
}

export class ServiceUnavailableError extends HttpException {
  constructor(message: string, errors?: string[]) {
    super(StatusCodes.SERVICE_UNAVAILABLE, 1032, message, errors);
  }
}
