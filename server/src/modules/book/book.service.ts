import { BookModel } from './book.model';
import { CreateBookDto, UpdateBookDto } from './book.types';

export const getAllBooks = async (search?: string) => {
  const query = search
    ? { $text: { $search: search } }
    : {};
  return BookModel.find(query).sort({ createdAt: -1 });
};

export const getBookById = async (id: string) => {
  const book = await BookModel.findById(id);
  if (!book) throw Object.assign(new Error('Book not found'), { statusCode: 404 });
  return book;
};

export const createBook = async (dto: CreateBookDto) => {
  const existing = await BookModel.findOne({ isbn: dto.isbn });
  if (existing) throw Object.assign(new Error('A book with this ISBN already exists'), { statusCode: 409 });
  return BookModel.create({ ...dto, availableCopies: dto.totalCopies });
};

export const updateBook = async (id: string, dto: UpdateBookDto) => {
  const book = await BookModel.findByIdAndUpdate(id, dto, { new: true, runValidators: true });
  if (!book) throw Object.assign(new Error('Book not found'), { statusCode: 404 });
  return book;
};

export const deleteBook = async (id: string) => {
  const book = await BookModel.findByIdAndDelete(id);
  if (!book) throw Object.assign(new Error('Book not found'), { statusCode: 404 });
};
