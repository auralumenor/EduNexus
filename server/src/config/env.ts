import { config } from 'dotenv';
config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_db',
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'lms_default_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};
