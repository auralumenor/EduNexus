import api from './api';
import { AuthUser } from '../types';

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { name: string; email: string; password: string; role?: string; }

export const loginUser = async (payload: LoginPayload) =>
  api.post<{ status: string; data: { token: string; user: AuthUser } }>('/auth/login', payload);

export const registerUser = async (payload: RegisterPayload) =>
  api.post<{ status: string; data: { token: string; user: AuthUser } }>('/auth/register', payload);

export const fetchMe = async () =>
  api.get<{ status: string; data: AuthUser }>('/auth/me');

export const updateMe = async (payload: { name?: string; email?: string }) =>
  api.put<{ status: string; data: AuthUser }>('/auth/me', payload);

export const updatePassword = async (payload: { currentPassword?: string; newPassword?: string }) =>
  api.put<{ status: string; message: string }>('/auth/me/password', payload);

export const deleteAccount = async () =>
  api.delete<{ status: string; message: string }>('/auth/me');

export const forgotPassword = async (email: string) =>
  api.post<{ status: string; message: string }>('/auth/forgot-password', { email });

export const resetPassword = async (token: string, password: string) =>
  api.put<{ status: string; message: string }>(`/auth/reset-password/${token}`, { password });
