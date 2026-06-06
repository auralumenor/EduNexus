import { Router } from 'express';
import * as userController from './user.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.route('/')
  .get(userController.getMembers)
  .post(userController.createMember);

router.route('/:id')
  .get(userController.getMember)
  .put(userController.updateMember)
  .delete(userController.deleteMember);

export default router;
