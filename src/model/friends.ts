import { sequelize } from '../db';
import { DataTypes } from 'sequelize';
import User from './user';

const Friends = sequelize.define(
  'Friends',
  {
    User1Id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    User2Id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    tableName: 'friends',
    timestamps: false,
  }
);

export default Friends;
