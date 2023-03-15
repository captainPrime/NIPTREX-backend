import { IApiErrorArguments } from "../interfaces/api-error.interface";
import { IResponseStatusCodes } from "../interfaces/response.interface";


export class ApiError extends Error {
  public readonly name: string;
  public readonly statusCode: IResponseStatusCodes;
  public readonly isOperational?: boolean = true;

  constructor(args: IApiErrorArguments) {
    super(args.message);

    Object.setPrototypeOf(this, new.target.prototype)

    this.name = args.name || "Error";
    this.statusCode = args.statusCode;

    if (args.isOperational) this.isOperational === args.isOperational;

    Error.captureStackTrace(this);
  }
}
