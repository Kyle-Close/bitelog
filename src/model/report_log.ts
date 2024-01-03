import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const ReportLogs = sequelize.define(
  'ReportLogs',
  {
    discomfort_rating: {
      type: DataTypes.ENUM,
      values: ['1', '2', '3', '4', '5'],
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'ReportLogs',
  }
);

export default ReportLogs;
