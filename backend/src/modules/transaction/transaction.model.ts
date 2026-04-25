import mongoose, { Schema } from 'mongoose';
import { ITransaction } from './transaction.types';

const TransactionSchema = new Schema<ITransaction>(
  {
    book:         { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    member:       { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    borrowedDate: { type: Date, default: Date.now },
    dueDate:      { type: Date, required: true },
    returnedDate: { type: Date },
    status:       { type: String, enum: ['borrowed', 'returned', 'overdue'], default: 'borrowed' },
    fine:         { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TransactionModel = mongoose.model<ITransaction>('Transaction', TransactionSchema);
