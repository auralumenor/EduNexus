import app from '../backend/src/app';
import { connectDB } from '../backend/src/config/db';
import { connectSQL } from '../backend/src/config/sql';

/**
 * Vercel Serverless Function entry point.
 * This file wraps the Express app and ensures the database is connected
 * before handling any incoming requests.
 */
export default async (req: any, res: any) => {
  try {
    // Pre-flight check
    const hasMongo = !!(process.env.MONGO_URI);
    const hasSQL = !!(process.env.DATABASE_URL || process.env.SQLITE_DB_PATH);
    console.log(`🔍 Pre-flight check: MONGO_URI is ${hasMongo ? 'DEFINED' : 'MISSING'}, SQL is ${hasSQL ? 'DEFINED' : 'MISSING'}`);
    
    // Ensure database connections are active
    await connectDB();
    await connectSQL();
    
    console.log(`🚀 Bridge triggered: ${req.method} ${req.url}`);
    
    // Pass the request to the Express application
    return app(req, res);
  } catch (error: any) {
    console.error('❌ Serverless Bridge Error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'EduNexus API Bridge failed to initialize',
      details: error.message || 'Unknown initialization error',
      timestamp: new Date().toISOString()
    });
  }
};
