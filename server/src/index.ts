import app from './app';
import { connectDB } from './config/db';
import { ENV } from './config/env';
import { syncOverdueTransactions } from './modules/transaction/transaction.service';

const startServer = async () => {
  await connectDB();

  // Mark any borrowed transactions past their due date as overdue on startup
  try {
    const count = await syncOverdueTransactions();
    if (count > 0) console.log(`📋 Marked ${count} transaction(s) as overdue`);
  } catch (err) {
    console.warn('⚠️  Could not sync overdue transactions:', err);
  }

  app.listen(ENV.PORT, () => {
    console.log(`Server is running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
  });
};

startServer();
