import { Document } from 'mongoose';

export type MemberStatus = 'active' | 'suspended' | 'expired';
export type MembershipType = 'basic' | 'premium';

export interface IMember extends Document {
  name: string;
  email: string;
  phone: string;
  membershipId: string;
  membershipType: MembershipType;
  status: MemberStatus;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemberDto {
  name: string;
  email: string;
  phone: string;
  membershipType?: MembershipType;
}

export type UpdateMemberDto = Partial<CreateMemberDto> & {
  status?: MemberStatus;
};
