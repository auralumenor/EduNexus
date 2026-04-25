import app from '../src/app';
import { connectDB } from '../src/config/db';
import { connectSQL } from '../src/config/sql';

export default async (req: any, res: any) => {
  try {
    await connectDB();
    await connectSQL();
    return app(req, res);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
