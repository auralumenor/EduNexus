import { Router } from 'express';
import * as txController from './transaction.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/',          txController.getTransactions);
router.get('/:id',       txController.getTransaction);
router.post('/borrow',   txController.borrowBook);
router.patch('/:id/return', txController.returnBook);

export default router;
