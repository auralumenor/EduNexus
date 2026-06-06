import { Router } from 'express';
import { register, login, getMe, forgotPassword, resetPassword, updateMe, updatePassword, deleteMe } from './auth.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/me/password', protect, updatePassword);
router.delete('/me', protect, deleteMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
