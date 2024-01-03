import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const EatFoodLogs = sequelize.define(
  'EatFoodLogs',
  {
    Amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    tableName: 'EatFoodLogs',
    timestamps: false,
  }
);

export default EatFoodLogs;
