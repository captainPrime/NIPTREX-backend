import { IResponseStatusCodes } from "./response.interface";

export interface IApiErrorArguments {
  message: string;
  name?: string;
  statusCode: IResponseStatusCodes;
  isOperational?: boolean;
}
