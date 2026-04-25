import { Sequelize } from 'sequelize';
import { ENV } from './env';
import path from 'path';

/**
 * SQL Database connection (Sequelize with SQLite)
 * This provides ACID compliance for Transactions and Users
 * while MongoDB handles the flexible Book catalog.
 */
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ENV.SQLITE_PATH || './database.sqlite',
  logging: false,
});

export const connectSQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQL Database (SQLite) Connected');
    
    // Sync models (in dev we use alter: true)
    if (ENV.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('📦 SQL Models Synchronized');
    }
  } catch (error: any) {
    console.error('❌ SQL Connection failed:', error.message);
  }
};
