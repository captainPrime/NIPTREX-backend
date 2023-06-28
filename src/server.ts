import App from '@/app';
import JobRoute from './routes/job.route';
import ChatRoute from './routes/chat.route';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import ErrorMiddleware from '@middlewares/error.middleware';
import ProfileRoute from './routes/profile.route';
import BidRoute from './routes/bid.route';
import WalletRoute from './routes/wallet.route';
import ServiceRoute from './routes/service.route';
import RatingRoute from './routes/rating.route';

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new ProfileRoute(),
  new JobRoute(),
  new BidRoute(),
  new ChatRoute(),
  new WalletRoute(),
  new ServiceRoute(),
  new RatingRoute(),
]);

app.listen();

ErrorMiddleware.initializeUnhandledException();

process.on('SIGTERM', () => {
  console.info('SIGTERM received');
});
