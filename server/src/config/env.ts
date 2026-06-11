import { config } from 'dotenv';
config();

const isProd = process.env.NODE_ENV === 'production';

// In production these variables must be explicitly set — no insecure defaults.
if (isProd) {
  const required = ['MONGO_URI', 'JWT_SECRET', 'FRONTEND_URL'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_db',
  NODE_ENV: process.env.NODE_ENV || 'development',
  // In production, JWT_SECRET must be a strong random string — no fallback provided.
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};
