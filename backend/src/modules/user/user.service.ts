import { MemberModel } from './user.model';
import { CreateMemberDto, UpdateMemberDto } from './user.types';

export const getAllMembers = async (search?: string) => {
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { membershipId: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
  return MemberModel.find(query).sort({ createdAt: -1 });
};

export const getMemberById = async (id: string) => {
  const member = await MemberModel.findById(id);
  if (!member) throw Object.assign(new Error('Member not found'), { statusCode: 404 });
  return member;
};

export const createMember = async (dto: CreateMemberDto) => {
  const existing = await MemberModel.findOne({ email: dto.email });
  if (existing) throw Object.assign(new Error('A member with this email already exists'), { statusCode: 409 });
  return MemberModel.create(dto);
};

export const updateMember = async (id: string, dto: UpdateMemberDto) => {
  const member = await MemberModel.findByIdAndUpdate(id, dto, { new: true, runValidators: true });
  if (!member) throw Object.assign(new Error('Member not found'), { statusCode: 404 });
  return member;
};

export const deleteMember = async (id: string) => {
  const member = await MemberModel.findByIdAndDelete(id);
  if (!member) throw Object.assign(new Error('Member not found'), { statusCode: 404 });
};
