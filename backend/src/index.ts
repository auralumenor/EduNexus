import app from './app';
import { connectDB } from './config/db';
import { ENV } from './config/env';

const startServer = async () => {
  await connectDB();
  
  app.listen(Number(ENV.PORT), '127.0.0.1', () => {
    console.log(`Server is running in ${ENV.NODE_ENV} mode on http://127.0.0.1:${ENV.PORT}`);
  });
};

startServer();
