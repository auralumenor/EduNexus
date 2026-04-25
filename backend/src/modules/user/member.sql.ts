import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/sql';

export class MemberSQL extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public membershipId!: string;
  public membershipType!: 'basic' | 'premium';
  public status!: 'active' | 'suspended' | 'expired';
  public joinedAt!: Date;
}

MemberSQL.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    membershipId: {
      type: DataTypes.STRING,
      unique: true,
    },
    membershipType: {
      type: DataTypes.ENUM('basic', 'premium'),
      defaultValue: 'basic',
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'expired'),
      defaultValue: 'active',
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'members',
    hooks: {
      beforeCreate: (member: MemberSQL) => {
        if (!member.membershipId) {
          member.membershipId = `LMS-${Date.now().toString(36).toUpperCase()}`;
        }
      },
    },
  }
);
