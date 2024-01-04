import { sequelize } from '../db';
import { DataTypes } from 'sequelize';

const Users = sequelize.define(
  'Users',
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'Users',
  }
);

export default Users;
