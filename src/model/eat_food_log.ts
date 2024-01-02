import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Eat_Food_Log = sequelize.define(
  'Eat_Food_Log',
  {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    tableName: 'eat_food_logs',
    timestamps: false,
  }
);

export default Eat_Food_Log;
