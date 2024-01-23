import { sequelize } from '../db';
import { DataTypes } from 'sequelize';
import Users from './user';

const Friends = sequelize.define(
  'Friends',
  {
    user1Id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Users,
        key: 'id',
      },
    },
    user2Id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Users,
        key: 'id',
      },
    },
  },
  {
    tableName: 'Friends',
  }
);

export default Friends;
