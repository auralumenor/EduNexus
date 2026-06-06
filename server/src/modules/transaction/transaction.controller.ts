import { Request, Response, NextFunction } from 'express';
import * as txService from './transaction.service';

export const getTransactions = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const txs = await txService.getAllTransactions();
    res.status(200).json({ status: 'success', data: txs });
  } catch (err) { next(err); }
};

export const getTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tx = await txService.getTransactionById(req.params.id);
    res.status(200).json({ status: 'success', data: tx });
  } catch (err) { next(err); }
};

export const borrowBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tx = await txService.borrowBook(req.body);
    res.status(201).json({ status: 'success', data: tx });
  } catch (err) { next(err); }
};

export const returnBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tx = await txService.returnBook({ transactionId: req.params.id });
    res.status(200).json({ status: 'success', data: tx });
  } catch (err) { next(err); }
};
