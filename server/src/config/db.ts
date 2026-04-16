import mongoose from 'mongoose';
import { ENV } from './env';

let memServer: any = null;

/**
 * In development with no real MongoDB available, we spin up an in-memory
 * MongoDB instance automatically so the server always starts without
 * needing Docker or a local mongod installation.
 */
const getConnectionUri = async (): Promise<string> => {
  // Use real URI if explicitly provided and not the default placeholder
  const hasRealUri =
    process.env.MONGO_URI &&
    !process.env.MONGO_URI.includes('localhost') &&
    !process.env.MONGO_URI.includes('127.0.0.1');

  if (hasRealUri) return ENV.MONGO_URI;

  if (ENV.NODE_ENV === 'development') {
    try {
      // Try real local MongoDB first (in case Docker/mongod is running)
      await mongoose.connect(ENV.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
      return ''; // already connected
    } catch {
      // Local MongoDB not available — fall back to in-memory server
      console.log('⚠️  Local MongoDB unavailable. Starting in-memory MongoDB for development...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memServer = await MongoMemoryServer.create();
      const uri = memServer.getUri();
      console.log(`🧠 In-memory MongoDB URI: ${uri}`);
      return uri;
    }
  }

  return ENV.MONGO_URI;
};

export const connectDB = async (): Promise<void> => {
  try {
    const uri = await getConnectionUri();
    if (uri) {
      // uri is empty string when already connected above
      await mongoose.connect(uri);
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    }
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (memServer) await memServer.stop();
};
