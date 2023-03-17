import { MONGODB_URI, MONGODB_URI_DEV } from '@config';

const connectionString = process.env.NODE_ENV === 'production' ? MONGODB_URI : MONGODB_URI_DEV;

export const dbConnection = {
  url: connectionString ?? MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
