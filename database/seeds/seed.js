/**
 * seed.js — Populate the database with sample data for development.
 * Usage: node database/seeds/seed.js
 * (MongoDB and backend must be configured in backend/.env)
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '../backend/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://Lumenor:d5b6ad144152@cluster0.efsvv3x.mongodb.net/lms_db?appName=Cluster0';

const BookSchema = new mongoose.Schema({ title: String, author: String, isbn: String, genre: String, description: String, totalCopies: Number, availableCopies: Number, publishedYear: Number, publisher: String }, { timestamps: true });
const Book = mongoose.model('Book', BookSchema);

const sampleBooks = [
  { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', genre: 'Programming', description: 'A handbook of agile software craftsmanship.', totalCopies: 5, availableCopies: 5, publishedYear: 2008, publisher: 'Prentice Hall' },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '9780135957059', genre: 'Programming', description: 'From journeyman to master.', totalCopies: 3, availableCopies: 3, publishedYear: 2019, publisher: 'Addison-Wesley' },
  { title: 'Design Patterns', author: 'Gang of Four', isbn: '9780201633610', genre: 'Software Engineering', description: 'Elements of reusable object-oriented software.', totalCopies: 4, availableCopies: 4, publishedYear: 1994, publisher: 'Addison-Wesley' },
  { title: 'Introduction to Algorithms', author: 'Cormen et al.', isbn: '9780262046305', genre: 'Computer Science', description: 'The definitive textbook on algorithms.', totalCopies: 6, availableCopies: 6, publishedYear: 2022, publisher: 'MIT Press' },
  { title: 'You Don\'t Know JS', author: 'Kyle Simpson', isbn: '9781491924464', genre: 'Programming', description: 'Deep dive into JavaScript mechanics.', totalCopies: 4, availableCopies: 4, publishedYear: 2015, publisher: 'O\'Reilly Media' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Book.deleteMany({});
  await Book.insertMany(sampleBooks);
  console.log(`✓ Inserted ${sampleBooks.length} sample books`);

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch(err => { console.error(err); process.exit(1); });
