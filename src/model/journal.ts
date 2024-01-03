import { DataTypes } from 'sequelize';
import { sequelize } from '../db';
import User from './user';

const Journal = sequelize.define(
  'Journal',
  {
    Name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'journals',
    timestamps: false,
  }
);

export default Journal;
