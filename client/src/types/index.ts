// Shared TypeScript types used across client features

export type UserRole = 'admin' | 'librarian';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description: string;
  coverImage?: string;
  totalCopies: number;
  availableCopies: number;
  publishedYear: number;
  publisher: string;
  createdAt: string;
  updatedAt: string;
}

export type MemberStatus = 'active' | 'suspended' | 'expired';
export type MembershipType = 'basic' | 'premium';

export interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  membershipId: string;
  membershipType: MembershipType;
  status: MemberStatus;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionStatus = 'borrowed' | 'returned' | 'overdue';

export interface Transaction {
  _id: string;
  book: Pick<Book, '_id' | 'title' | 'author' | 'isbn'>;
  member: Pick<Member, '_id' | 'name' | 'email' | 'membershipId'>;
  borrowedDate: string;
  dueDate: string;
  returnedDate?: string;
  status: TransactionStatus;
  fine: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}
