import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const EatFoodLogs = sequelize.define(
  'EatFoodLogs',
  {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'EatFoodLogs',
  }
);

export default EatFoodLogs;
