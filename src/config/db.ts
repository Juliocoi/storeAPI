import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './src/config/.env' });

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!,
);

export const configDB = () =>
  mongoose
    .connect(DB)
    .then(() => {
      console.log('Conected to MongoDB...');
    })
    .catch((err) => console.error('MongoDB not conected: ', err));
