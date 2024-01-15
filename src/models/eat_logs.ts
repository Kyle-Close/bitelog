import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const EatLogs = sequelize.define(
  'EatLogs',
  {
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'EatLogs',
  }
);

export default EatLogs;
