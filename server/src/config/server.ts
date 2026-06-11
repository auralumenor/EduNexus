const isDev = process.env.NODE_ENV !== 'production';

// In production, ALLOWED_ORIGINS must be set explicitly.
// In development, localhost origins are allowed as a convenience fallback.
const devOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

export const SERVER_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : isDev
      ? devOrigins
      : [], // no origins allowed in production unless explicitly configured
  PAGINATION_LIMIT: 20,
  DEFAULT_FINE_PER_DAY: 5, // ₹5 per day overdue fine
  LOAN_PERIOD_DAYS: 14,    // default borrow period
};
