import { sequelize } from '../db';
import { DataTypes } from 'sequelize';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    timestamps: false,
  }
);

export default User;
