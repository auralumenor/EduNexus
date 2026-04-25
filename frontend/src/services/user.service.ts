import api from './api';
import { Member } from '../types';

export const getMembers = (search?: string) =>
  api.get<{ status: string; data: Member[] }>('/members', { params: search ? { search } : {} });

export const getMember = (id: string) =>
  api.get<{ status: string; data: Member }>(`/members/${id}`);

export const createMember = (payload: Partial<Member>) =>
  api.post<{ status: string; data: Member }>('/members', payload);

export const updateMember = (id: string, payload: Partial<Member>) =>
  api.put<{ status: string; data: Member }>(`/members/${id}`, payload);

export const deleteMember = (id: string) =>
  api.delete(`/members/${id}`);
