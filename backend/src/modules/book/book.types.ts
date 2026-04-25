import { Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description: string;
  coverImage?: string;
  totalCopies: number;
  availableCopies: number;
  publishedYear: number;
  publisher: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description?: string;
  coverImage?: string;
  totalCopies: number;
  publishedYear: number;
  publisher: string;
}

export type UpdateBookDto = Partial<CreateBookDto>;
