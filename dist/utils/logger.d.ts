/// <reference types="node" />
import winstonDaily from 'winston-daily-rotate-file';
export declare class Logger {
    static getInstance: (service?: string) => import("winston").Logger;
    static logFormat: import("logform").Format;
    static info: (message: string) => void;
    static error: (message: string) => void;
    static getErrorLoggerTransport: () => winstonDaily;
    static getDebugLoggerTransport: () => winstonDaily;
    static getHttpLoggerInstance: () => (req: import("http").IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage>, callback: (err?: Error) => void) => void;
}
export declare const logger: import("winston").Logger;
