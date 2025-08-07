export declare class HttpException extends Error {
    status: number;
    responseCode: number;
    message: string;
    data: any[];
    constructor(status: number, responseCode: number, message: string, data?: any);
}
export declare class NotFoundError extends HttpException {
    constructor(path: string);
}
export declare class BadRequestError extends HttpException {
    constructor(message: string, errors: string[]);
}
export declare class ApplicationError extends HttpException {
    constructor(message: string, errors?: string[]);
}
export declare class ServiceUnavailableError extends HttpException {
    constructor(message: string, errors?: string[]);
}
