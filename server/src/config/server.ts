export const SERVER_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
  ALLOWED_ORIGINS: ['http://localhost:3000', 'http://localhost:5173'],
  PAGINATION_LIMIT: 20,
  DEFAULT_FINE_PER_DAY: 5, // ₹5 per day overdue fine
  LOAN_PERIOD_DAYS: 14,    // default borrow period
};
