import express from 'express';
import { Routes } from './interfaces/routes.interface';
declare class App {
    app: express.Application;
    env: string;
    port: string | number;
    private server;
    private io;
    constructor(routes: Routes[]);
    listen(): void;
    getServer(): express.Application;
    private connectToDatabase;
    private initializeMiddlewares;
    private initializeRoutes;
    private initializeSwagger;
    private initializeErrorHandling;
    private initializeSockets;
}
export default App;
