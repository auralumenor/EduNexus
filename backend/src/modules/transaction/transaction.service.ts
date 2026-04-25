import { TransactionModel } from './transaction.model';
import { BookModel } from '../book/book.model';
import { MemberModel } from '../user/user.model';
import { BorrowBookDto, ReturnBookDto } from './transaction.types';
import { SERVER_CONFIG } from '../../config/server';

export const getAllTransactions = async () =>
  TransactionModel.find()
    .populate('book', 'title author isbn')
    .populate('member', 'name email membershipId')
    .sort({ createdAt: -1 });

export const getTransactionById = async (id: string) => {
  const tx = await TransactionModel.findById(id)
    .populate('book', 'title author isbn')
    .populate('member', 'name email membershipId');
  if (!tx) throw Object.assign(new Error('Transaction not found'), { statusCode: 404 });
  return tx;
};

export const borrowBook = async (dto: BorrowBookDto) => {
  const book = await BookModel.findById(dto.bookId);
  if (!book) throw Object.assign(new Error('Book not found'), { statusCode: 404 });
  if (book.availableCopies <= 0) throw Object.assign(new Error('No copies available'), { statusCode: 400 });

  const member = await MemberModel.findById(dto.memberId);
  if (!member) throw Object.assign(new Error('Member not found'), { statusCode: 404 });
  if (member.status !== 'active') throw Object.assign(new Error('Member account is not active'), { statusCode: 400 });

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + SERVER_CONFIG.LOAN_PERIOD_DAYS);

  const tx = await TransactionModel.create({
    book: dto.bookId,
    member: dto.memberId,
    dueDate,
    status: 'borrowed',
  });

  book.availableCopies -= 1;
  await book.save();

  return tx.populate(['book', 'member']);
};

export const returnBook = async (dto: ReturnBookDto) => {
  const tx = await TransactionModel.findById(dto.transactionId);
  if (!tx) throw Object.assign(new Error('Transaction not found'), { statusCode: 404 });
  if (tx.status === 'returned') throw Object.assign(new Error('Book already returned'), { statusCode: 400 });

  const now = new Date();
  const overdueDays = Math.max(0, Math.ceil((now.getTime() - tx.dueDate.getTime()) / (1000 * 60 * 60 * 24)));
  const fine = overdueDays * SERVER_CONFIG.DEFAULT_FINE_PER_DAY;

  tx.returnedDate = now;
  tx.status = 'returned';
  tx.fine = fine;
  await tx.save();

  const book = await BookModel.findById(tx.book);
  if (book) {
    book.availableCopies += 1;
    await book.save();
  }

  return tx.populate(['book', 'member']);
};
