// Server-side shared utility helpers

/** Creates an Error with an attached HTTP status code */
export const createError = (message: string, statusCode: number): Error => {
  const err = new Error(message) as Error & { statusCode: number };
  err.statusCode = statusCode;
  return err;
};

/** Formats a Mongoose validation error into a readable string */
export const formatValidationError = (err: any): string => {
  if (err.name === 'ValidationError') {
    return Object.values(err.errors)
      .map((e: any) => e.message)
      .join(', ');
  }
  return err.message;
};

/** Generates a random alphanumeric string of given length */
export const randomCode = (length = 8): string =>
  Math.random().toString(36).substring(2, 2 + length).toUpperCase();
