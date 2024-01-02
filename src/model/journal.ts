import { DataTypes } from 'sequelize';
import { sequelize } from '../db';
import User from './user';

const Journal = sequelize.define(
  'Journal',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'journals',
    timestamps: false,
  }
);

export default Journal;
