import mongoose from 'mongoose';
import { ENV } from './env';

let memServer: any = null;

/**
 * In development with no real MongoDB available, we spin up an in-memory
 * MongoDB instance automatically so the server always starts without
 * needing Docker or a local mongod installation.
 *
 * In production, MONGO_URI must be set to a real connection string (e.g. MongoDB Atlas).
 * The in-memory fallback is never used outside of development.
 */
const getConnectionUri = async (): Promise<string> => {
  // Production — always use the provided URI, no fallback
  if (ENV.NODE_ENV === 'production') {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is required in production');
    }
    return ENV.MONGO_URI;
  }

  // Development — try the configured URI first, fall back to in-memory
  if (ENV.NODE_ENV === 'development') {
    try {
      await mongoose.connect(ENV.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
      return ''; // already connected
    } catch {
      console.log('⚠️  Local MongoDB unavailable. Starting in-memory MongoDB for development...');
      // @ts-ignore — mongodb-memory-server is a dev-only dependency, not available in production
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
