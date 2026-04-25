import api from './api';
import { Transaction } from '../types';

export const getTransactions = () =>
  api.get<{ status: string; data: Transaction[] }>('/transactions');

export const getTransaction = (id: string) =>
  api.get<{ status: string; data: Transaction }>(`/transactions/${id}`);

export const borrowBook = (bookId: string, memberId: string) =>
  api.post<{ status: string; data: Transaction }>('/transactions/borrow', { bookId, memberId });

export const returnBook = (transactionId: string) =>
  api.patch<{ status: string; data: Transaction }>(`/transactions/${transactionId}/return`);
