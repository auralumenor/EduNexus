import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.login(req.body);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe((req as any).user.id);
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.status(200).json({ status: 'success', message: 'Token sent to email!' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.resetPassword(req.params.token, req.body.password);
    res.status(200).json({ status: 'success', message: 'Password reset successful!' });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.updateMe((req as any).user.id, {
      name: req.body.name,
      email: req.body.email
    });
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.updatePassword((req as any).user.id, req.body.currentPassword, req.body.newPassword);
    res.status(200).json({ status: 'success', message: 'Password updated' });
  } catch (error) {
    next(error);
  }
};

export const deleteMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.deleteMe((req as any).user.id);
    res.status(200).json({ status: 'success', message: 'Account deleted' });
  } catch (error) {
    next(error);
  }
};
