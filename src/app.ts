/* eslint-disable @typescript-eslint/ban-ts-comment */
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { connect, set } from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import tooBusy from 'toobusy-js';
import xss from 'xss-clean';
import { createServer, Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { NODE_ENV, PORT, ORIGIN, HAS_CREDENTIALS } from '@config';
import { dbConnection } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import ErrorMiddleware from '@middlewares/error.middleware';
import { logger, Logger } from '@utils/logger';
import { NotFoundError, ServiceUnavailableError } from '@exceptions/HttpException';

class App {
  public app: Application;
  public env: string;
  public port: string | number;
  private server: HTTPServer;
  private io: Server;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();

    this.server = createServer(this.app);
    this.io = new Server(this.server);

    this.initializeSockets();
  }

  public listen() {
    this.server.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer(): Application {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    // @ts-ignore
    connect(dbConnection.url, dbConnection.options)
      .then(() => {
        logger.info('Connected to Database Successfully...');
      })
      .catch(error => {
        logger.error(`Error connecting to Database: ${error}`);
      });
  }

  private initializeMiddlewares() {
    this.app.use(Logger.getHttpLoggerInstance());
    this.app.use(cors({ origin: ORIGIN, credentials: HAS_CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(xss());
    this.app.use(ExpressMongoSanitize());
    this.app.use(compression());
    this.app.use(express.json({ limit: '50kb' }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (tooBusy()) {
        next(new ServiceUnavailableError('Server too busy!'));
      } else {
        next();
      }
    });
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'NIPTREX',
          version: '1.0.0',
          description: 'API Documentation',
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError(req.path)));
    this.app.use(ErrorMiddleware.handleError());
  }

  private initializeSockets() {
    this.io.on('connection', (socket: Socket) => {
      logger.info('New socket connection:', socket.id);

      socket.on('chat message', (message: string) => {
        console.log('Message:', message);
        this.server.emit('chat message', message);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }
}

export default App;
