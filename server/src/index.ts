import app from './app';
import { connectDB } from './config/db';
import { ENV } from './config/env';

const startServer = async () => {
  await connectDB();
  
  app.listen(ENV.PORT, () => {
    console.log(`Server is running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
  });
};

startServer();
