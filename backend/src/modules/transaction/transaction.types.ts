import { Document, Types } from 'mongoose';

export type TransactionStatus = 'borrowed' | 'returned' | 'overdue';

export interface ITransaction extends Document {
  book: Types.ObjectId;
  member: Types.ObjectId;
  borrowedDate: Date;
  dueDate: Date;
  returnedDate?: Date;
  status: TransactionStatus;
  fine: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionDto {
  bookId: string;    // MongoDB ID
  memberId: string;  // SQL ID
}

export interface ReturnBookDto {
  transactionId: string;
}
