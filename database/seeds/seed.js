/**
 * seed.js — Populate the database with sample data for development.
 * Usage: node database/seeds/seed.js
 */

const mongoose = require('mongoose');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../backend/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_db';
const SQLITE_PATH = process.env.SQLITE_DB_PATH || '../backend/database.sqlite';

// MongoDB Schema
const BookSchema = new mongoose.Schema({ title: String, author: String, isbn: String, genre: String, description: String, totalCopies: Number, availableCopies: Number, publishedYear: Number, publisher: String }, { timestamps: true });
const Book = mongoose.model('Book', BookSchema);

// SQL Setup (Sequelize)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: SQLITE_PATH,
  logging: false,
});

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'librarian'), defaultValue: 'librarian' },
}, { tableName: 'users' });

const Member = sequelize.define('Member', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: false },
  membershipId: { type: DataTypes.STRING, unique: true },
  membershipType: { type: DataTypes.ENUM('basic', 'premium'), defaultValue: 'basic' },
  status: { type: DataTypes.ENUM('active', 'suspended', 'expired'), defaultValue: 'active' },
}, { tableName: 'members' });

const sampleBooks = [
  { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', genre: 'Programming', description: 'A handbook of agile software craftsmanship.', totalCopies: 5, availableCopies: 5, publishedYear: 2008, publisher: 'Prentice Hall' },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '9780135957059', genre: 'Programming', description: 'From journeyman to master.', totalCopies: 3, availableCopies: 3, publishedYear: 2019, publisher: 'Addison-Wesley' },
  { title: 'Design Patterns', author: 'Gang of Four', isbn: '9780201633610', genre: 'Software Engineering', description: 'Elements of reusable object-oriented software.', totalCopies: 4, availableCopies: 4, publishedYear: 1994, publisher: 'Addison-Wesley' },
  { title: 'Introduction to Algorithms', author: 'Cormen et al.', isbn: '9780262046305', genre: 'Computer Science', description: 'The definitive textbook on algorithms.', totalCopies: 6, availableCopies: 6, publishedYear: 2022, publisher: 'MIT Press' },
  { title: 'You Don\'t Know JS', author: 'Kyle Simpson', isbn: '9781491924464', genre: 'Programming', description: 'Deep dive into JavaScript mechanics.', totalCopies: 4, availableCopies: 4, publishedYear: 2015, publisher: 'O\'Reilly Media' },
];

async function seed() {
  // 1. Seed MongoDB
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
  await Book.deleteMany({});
  await Book.insertMany(sampleBooks);
  console.log(`✓ Inserted ${sampleBooks.length} sample books into MongoDB`);
  await mongoose.disconnect();

  // 2. Seed SQL
  await sequelize.authenticate();
  console.log('Connected to SQL (SQLite)');
  await sequelize.sync({ force: true }); // Reset SQL tables

  const adminPass = await bcrypt.hash('admin123', 10);
  const demoPass = await bcrypt.hash('demo123', 10);
  
  await User.create({
    name: 'System Admin',
    email: 'admin@edunexus.local',
    password: adminPass,
    role: 'admin'
  });

  await User.create({
    name: 'Demo Librarian',
    email: 'demo@edunexus.com',
    password: demoPass,
    role: 'librarian'
  });
  console.log('✓ Created Admin and Demo Librarian users in SQL');

  await Member.create({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-0101',
    membershipId: 'LMS-SEEDED-001',
    membershipType: 'premium'
  });
  console.log('✓ Created sample Member in SQL');

  await sequelize.close();
  console.log('Done.');
}

seed().catch(err => { console.error(err); process.exit(1); });
