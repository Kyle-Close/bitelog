import { sequelize } from '../db';
import { DataTypes } from 'sequelize';

const Friends = sequelize.define(
  'Friends',
  {
    user1_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    user2_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: 'friends',
    timestamps: false,
  }
);

export default Friends;
