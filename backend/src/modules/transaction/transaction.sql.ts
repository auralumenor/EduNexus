import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/sql';
import { MemberSQL } from '../user/member.sql';

export class TransactionSQL extends Model {
  public id!: number;
  public bookId!: string; // MongoDB ObjectId string
  public memberId!: number; // SQL id
  public borrowedDate!: Date;
  public dueDate!: Date;
  public returnedDate?: Date;
  public status!: 'borrowed' | 'returned' | 'overdue';
  public fine!: number;
}

TransactionSQL.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bookId: {
      type: DataTypes.STRING, // Store MongoDB ID as string
      allowNull: false,
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MemberSQL,
        key: 'id',
      },
    },
    borrowedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returnedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('borrowed', 'returned', 'overdue'),
      defaultValue: 'borrowed',
    },
    fine: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'transactions',
  }
);

TransactionSQL.belongsTo(MemberSQL, { foreignKey: 'memberId', as: 'member' });
