import { Request, Response, NextFunction } from 'express';
import * as bookService from './book.service';

export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookService.getAllBooks(req.query.search as string);
    res.status(200).json({ status: 'success', data: books });
  } catch (err) { next(err); }
};

export const getBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.status(200).json({ status: 'success', data: book });
  } catch (err) { next(err); }
};

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json({ status: 'success', data: book });
  } catch (err) { next(err); }
};

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: book });
  } catch (err) { next(err); }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await bookService.deleteBook(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};
