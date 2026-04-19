import mongoose from 'mongoose';
import { ENV } from './env';

let memServer: any = null;

/**
 * In development with no real MongoDB available, we spin up an in-memory
 * MongoDB instance automatically so the server always starts without
 * needing Docker or a local mongod installation.
 */
const getConnectionUri = async (): Promise<string> => {
  // 1. Prioritize explicitly provided MONGO_URI
  const rawUri = process.env.MONGO_URI || ENV.MONGO_URI;
  
  const isLocal = !rawUri || rawUri.includes('localhost') || rawUri.includes('127.0.0.1');

  // 2. Strict check for production (Vercel)
  if (ENV.NODE_ENV === 'production' && isLocal) {
    throw new Error(
      'Production database URI missing. Please ensure MONGO_URI is set in Vercel Environment Variables and does not point to localhost.'
    );
  }

  // 3. If we have a real remote URI, use it
  if (!isLocal) return rawUri;

  // 4. Development Fallback logic
  if (ENV.NODE_ENV === 'development') {
    try {
      // Try local MongoDB first
      await mongoose.connect(rawUri, { serverSelectionTimeoutMS: 2000 });
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
      return ''; // already connected
    } catch {
      console.log('⚠️  Local MongoDB unavailable. Starting in-memory MongoDB...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memServer = await MongoMemoryServer.create();
      return memServer.getUri();
    }
  }

  return rawUri;
};

export const connectDB = async (): Promise<void> => {
  // If already connected, do not attempt to reconnect (crucial for serverless)
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const uri = await getConnectionUri();
    if (uri) {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    }
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:', error.message);
    // In serverless, we don't necessarily want to process.exit(1) 
    // as it might kill the function container unnecessarily.
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (memServer) await memServer.stop();
};
