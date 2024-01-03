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
    tableName: 'journals',
    timestamps: false,
  }
);

export default Journal;
