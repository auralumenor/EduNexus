import api from './api';
import { Book } from '../types';

export const getBooks = (search?: string) =>
  api.get<{ status: string; data: Book[] }>('/books', { params: search ? { search } : {} });

export const getBook = (id: string) =>
  api.get<{ status: string; data: Book }>(`/books/${id}`);

export const createBook = (payload: Partial<Book>) =>
  api.post<{ status: string; data: Book }>('/books', payload);

export const updateBook = (id: string, payload: Partial<Book>) =>
  api.put<{ status: string; data: Book }>(`/books/${id}`, payload);

export const deleteBook = (id: string) =>
  api.delete(`/books/${id}`);

export const fetchOpenLibraryData = async ({ title, author, isbn }: { title?: string; author?: string; isbn?: string }) => {
  const params = new URLSearchParams();
  
  if (isbn) {
    params.append('isbn', isbn);
  } else if (title && author) {
    params.append('title', title);
    params.append('author', author);
  } else if (title) {
    params.append('title', title);
  } else if (author) {
    params.append('author', author);
  } else {
    throw new Error('Please provide at least a title, author, or ISBN to search.');
  }

  const response = await fetch(`https://openlibrary.org/search.json?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch from OpenLibrary');
  }
  
  const data = await response.json();
  if (!data.docs || data.docs.length === 0) {
    throw new Error('Book not found in OpenLibrary');
  }
  
  // Prioritize a document that actually has an ISBN and Author data
  const book = data.docs.find((d: any) => d.isbn && d.isbn.length > 0 && d.author_name) || data.docs[0];
  
  return {
    title: book.title || '',
    author: book.author_name ? book.author_name.join(', ') : '',
    publisher: book.publisher ? book.publisher.join(', ') : '',
    publishedYear: book.first_publish_year || undefined,
    isbn: book.isbn ? book.isbn[0] : '',
    genre: book.subject ? book.subject.slice(0, 3).join(', ') : '',
    coverImage: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : ''
  };
};
