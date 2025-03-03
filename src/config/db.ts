import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './src/config/.env' });

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!,
);

export const configDB = async () => {
  try {
    await mongoose.connect(DB);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
