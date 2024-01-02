import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Report_Log = sequelize.define(
  'Report_Log',
  {
    discomfort_rating: {
      type: DataTypes.ENUM,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    timestamp: {
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
