import { DataTypes } from 'sequelize';
import { sequelize } from '../db';
import User from './user';

const User_Food = sequelize.define(
  'User_Food',
  {
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    tableName: 'user_foods',
    timestamps: false,
  }
);

export default User_Food;
