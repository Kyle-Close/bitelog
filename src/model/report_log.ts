import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Report_Log = sequelize.define(
  'Report_Log',
  {
    Discomfort_rating: {
      type: DataTypes.ENUM,
      values: ['1', '2', '3', '4', '5'],
      allowNull: false,
    },
    Notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'report_logs',
    timestamps: false,
  }
);

export default Report_Log;
