import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Eat_Food_Log = sequelize.define(
  'Eat_Food_Log',
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
    tableName: 'eat_food_logs',
    timestamps: false,
  }
);

export default Eat_Food_Log;
