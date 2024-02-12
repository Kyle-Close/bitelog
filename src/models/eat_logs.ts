import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const EatLogs = sequelize.define(
  'EatLogs',
  {
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'EatLogs',
  }
);

export default EatLogs;
