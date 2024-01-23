import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const UserFoods = sequelize.define(
  'UserFoods',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'UserFoods',
  }
);

export default UserFoods;
