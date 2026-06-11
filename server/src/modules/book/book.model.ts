import mongoose, { Schema } from 'mongoose';
import { IBook } from './book.types';

const BookSchema = new Schema<IBook>(
  {
    title:          { type: String, required: true, trim: true },
    author:         { type: String, required: true, trim: true },
    isbn:           { type: String, required: false, trim: true },
    genre:          { type: String, required: true, trim: true },
    description:    { type: String, default: '' },
    coverImage:     { type: String, default: '' },
    totalCopies:    { type: Number, required: true, min: 0 },
    availableCopies:{ type: Number, required: true, min: 0 },
    publishedYear:  { type: Number, required: false },
    publisher:      { type: String, required: false, trim: true },
  },
  { timestamps: true }
);

// Ensure availableCopies === totalCopies on creation if not provided
BookSchema.pre('save', function (next) {
  if (this.isNew && this.availableCopies === undefined) {
    this.availableCopies = this.totalCopies;
  }
  next();
});

// Full-text search indexes
BookSchema.index({ title: 'text', author: 'text', isbn: 'text', genre: 'text' });

// Sparse unique index on isbn — allows multiple books with no ISBN, but no duplicate ISBNs
BookSchema.index({ isbn: 1 }, { unique: true, sparse: true });

export const BookModel = mongoose.model<IBook>('Book', BookSchema);
