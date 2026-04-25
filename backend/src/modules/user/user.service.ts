import { MemberSQL as MemberModel } from './member.sql';
import { CreateMemberDto, UpdateMemberDto } from './user.types';
import { Op } from 'sequelize';

export const getAllMembers = async (search?: string) => {
  const where = search
    ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { membershipId: { [Op.like]: `%${search}%` } },
        ],
      }
    : {};
    
  return MemberModel.findAll({ 
    where,
    order: [['createdAt', 'DESC']]
  });
};

export const getMemberById = async (id: string) => {
  const member = await MemberModel.findByPk(id);
  if (!member) throw Object.assign(new Error('Member not found'), { statusCode: 404 });
  return member;
};

export const createMember = async (dto: CreateMemberDto) => {
  const existing = await MemberModel.findOne({ where: { email: dto.email } });
  if (existing) throw Object.assign(new Error('A member with this email already exists'), { statusCode: 409 });
  return MemberModel.create(dto as any);
};

export const updateMember = async (id: string, dto: UpdateMemberDto) => {
  const member = await MemberModel.findByPk(id);
  if (!member) throw Object.assign(new Error('Member not found'), { statusCode: 404 });
  
  await member.update(dto as any);
  return member;
};

export const deleteMember = async (id: string) => {
  const member = await MemberModel.findByPk(id);
  if (member) await member.destroy();
};
