import AdminJS from 'adminjs';
import * as AdminJSExpress from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose';
import { Express } from 'express';

import User from './models/users.model';
import { JobModel } from './models/job.model';
import { BiddingModel } from './models/bid.model';
import { ChatModel } from './models/chat.model';
import { Config } from './models/config.model';
import { Invoice } from './models/invoice.model';
import { Photography } from './models/photography.model';
// import { Profile } from './models/profile.model';
import { RatingModel } from './models/rating.model';
import { ServiceModel } from './models/service.models';
import { WalletModel } from './models/wallet.model';

// Register the AdminJS Mongoose adapter
AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const adminJs = new AdminJS({
  rootPath: '/admin',
  resources: [
    { resource: User },
    { resource: JobModel },
    { resource: BiddingModel },
    { resource: ChatModel },
    { resource: Config },
    { resource: Invoice },
    { resource: Photography },
    // { resource: Profile },
    { resource: RatingModel },
    { resource: ServiceModel },
    { resource: WalletModel },
  ],
});

const ADMIN = {
  email: 'admin@example.com',
  password: 'securepassword',
};

const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN;
    }
    return null;
  },
  cookieName: 'adminjs',
  cookiePassword: 'some-secret-password',
});

export const setupAdminPanel = (app: Express) => {
  app.use(adminJs.options.rootPath, router);
};
