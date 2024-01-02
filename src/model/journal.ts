import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Journal = sequelize.define(
  'Journal',
  {
    user_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
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
