import { sequelize } from '../db';
import { DataTypes } from 'sequelize';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
  }
);

export default User;
