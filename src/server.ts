import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import ErrorMiddleware from '@middlewares/error.middleware';
import ProfileRoute from './routes/profile.route';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new ProfileRoute()]);

app.listen();

ErrorMiddleware.initializeUnhandledException();

process.on('SIGTERM', () => {
  console.info('SIGTERM received');
});
