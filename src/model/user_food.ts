import { DataTypes } from 'sequelize';
import { sequelize } from '../db';
import User from './user';

const User_food = sequelize.define(
  'User_food',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    tableName: 'foods',
    timestamps: false,
  }
);

export default User_food;
