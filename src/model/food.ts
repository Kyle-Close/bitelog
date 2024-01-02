import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Food = sequelize.define(
  'Food',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'foods',
    timestamps: false,
  }
);

export default Food;
