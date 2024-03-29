import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Journal = sequelize.define(
  'Journal',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'Journals',
  }
);

export default Journal;
