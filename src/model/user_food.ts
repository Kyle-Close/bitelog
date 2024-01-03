import { DataTypes } from 'sequelize';
import { sequelize } from '../db';
import User from './user';

const User_Food = sequelize.define(
  'User_Food',
  {
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    tableName: 'user_foods',
    timestamps: false,
  }
);

export default User_Food;
