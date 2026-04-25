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
  
  const isAtlas = rawUri.includes('mongodb+srv://');
  const isLocal = !rawUri || rawUri.includes('localhost') || rawUri.includes('127.0.0.1');

  // 2. Strict check for production (Vercel)
  if (ENV.NODE_ENV === 'production' && isLocal) {
    throw new Error(
      'Production database URI missing. Please ensure MONGO_URI is set in Vercel Environment Variables and does not point to localhost.'
    );
  }

  // 3. Development logic: Try to connect to the provided URI, fall back to memory if it fails
  if (ENV.NODE_ENV === 'development') {
    try {
      console.log(`📡 Attempting to connect to MongoDB: ${isAtlas ? 'Atlas Cluster' : 'Local/Provided URI'}`);
      // Use a shorter timeout for the initial check in development
      await mongoose.connect(rawUri, { 
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 5000 
      });
      return ''; // already connected
    } catch (error: any) {
      console.log(`⚠️  MongoDB connection failed (${error.message}).`);
      
      if (isAtlas) {
        console.log('💡 Tip: Ensure your IP is whitelisted in Atlas and your credentials are correct.');
      }

      console.log('🚀 Falling back to in-memory MongoDB for local development...');
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
