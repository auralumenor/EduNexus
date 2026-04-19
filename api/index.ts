import app from '../server/src/app';
import { connectDB } from '../server/src/config/db';

/**
 * Vercel Serverless Function entry point.
 * This file wraps the Express app and ensures the database is connected
 * before handling any incoming requests.
 */
export default async (req: any, res: any) => {
  try {
    // Ensure database connection is active (connectDB handles multiple calls safely)
    await connectDB();
    
    // Pass the request to the Express application
    return app(req, res);
  } catch (error: any) {
    console.error('Serverless Function Error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal Server Error during bridge initialization',
      details: error.message 
    });
  }
};
