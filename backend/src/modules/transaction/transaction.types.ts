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

export interface BorrowBookDto {
  bookId: string;
  memberId: string;
}

export interface ReturnBookDto {
  transactionId: string;
}
