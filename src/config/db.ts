import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from './logger';

dotenv.config({ path: './src/config/.env' });

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!,
);

export const configDB = async () =>
  await mongoose
    .connect(DB)
    .then(() => {
      logger.info('Conected to MongoDB.');
    })
    .catch((err) => logger.error('MongoDB not conected: ', err));
