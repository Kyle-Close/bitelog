import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Ingredients = sequelize.define(
  'Ingredients',
  {
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'Ingredients',
    timestamps: false,
  }
);

export default Ingredients;
