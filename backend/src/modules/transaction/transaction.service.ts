import { TransactionSQL as TransactionModel } from './transaction.sql';
import { MemberSQL } from '../user/member.sql';
import { BookModel } from '../book/book.model';
import { CreateTransactionDto, ReturnBookDto } from './transaction.types';
import { SERVER_CONFIG } from '../../config/server';

export const borrowBook = async (dto: CreateTransactionDto) => {
  // 1. Check book availability (MongoDB)
  const book = await BookModel.findById(dto.bookId);
  if (!book) throw Object.assign(new Error('Book not found'), { statusCode: 404 });
  if (book.availableCopies <= 0) throw Object.assign(new Error('No copies available'), { statusCode: 400 });

  // 2. Check member status (SQL)
  const member = await MemberSQL.findByPk(dto.memberId);
  if (!member) throw Object.assign(new Error('Member not found'), { statusCode: 404 });
  if (member.status !== 'active') throw Object.assign(new Error('Member account is not active'), { statusCode: 400 });

  // 3. Create transaction (SQL)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + SERVER_CONFIG.LOAN_PERIOD_DAYS);

  const transaction = await TransactionModel.create({
    bookId: String(book._id),
    memberId: member.id,
    dueDate,
  } as any);

  // 4. Update book copies (MongoDB)
  book.availableCopies -= 1;
  await book.save();

  return transaction;
};

export const returnBook = async (dto: ReturnBookDto) => {
  const { transactionId } = dto;
  const transaction = await TransactionModel.findByPk(transactionId);
  if (!transaction) throw Object.assign(new Error('Transaction not found'), { statusCode: 404 });
  if (transaction.status === 'returned') throw Object.assign(new Error('Book already returned'), { statusCode: 400 });

  // 1. Update transaction status (SQL)
  transaction.returnedDate = new Date();
  transaction.status = 'returned';
  
  // Calculate fine if overdue
  if (transaction.returnedDate > transaction.dueDate) {
    const diffTime = Math.abs(transaction.returnedDate.getTime() - transaction.dueDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    transaction.fine = diffDays * SERVER_CONFIG.DEFAULT_FINE_PER_DAY;
  }
  
  await transaction.save();

  // 2. Update book copies (MongoDB)
  const book = await BookModel.findById(transaction.bookId);
  if (book) {
    book.availableCopies += 1;
    await book.save();
  }

  return transaction;
};

export const getAllTransactions = async (filters: any = {}) => {
  return TransactionModel.findAll({
    where: filters,
    include: [{ model: MemberSQL, as: 'member' }],
    order: [['createdAt', 'DESC']]
  });
};

export const getTransactionById = async (id: string) => {
  const tx = await TransactionModel.findByPk(id, {
    include: [{ model: MemberSQL, as: 'member' }]
  });
  if (!tx) throw Object.assign(new Error('Transaction not found'), { statusCode: 404 });
  return tx;
};
