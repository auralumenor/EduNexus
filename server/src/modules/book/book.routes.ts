import { Router } from 'express';
import * as bookController from './book.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect); // All book routes require auth

router.route('/')
  .get(bookController.getBooks)
  .post(bookController.createBook);

router.route('/:id')
  .get(bookController.getBook)
  .put(bookController.updateBook)
  .delete(bookController.deleteBook);

export default router;
