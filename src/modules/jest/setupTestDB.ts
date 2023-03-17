import mongoose from 'mongoose';
import { dbConnection } from '@/databases';

const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(dbConnection.url as string);
  });

  beforeEach(async () => {
    await Promise.all(Object.values(mongoose.connection.collections).map(async collection => collection.deleteMany({})));
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};

export default setupTestDB;
