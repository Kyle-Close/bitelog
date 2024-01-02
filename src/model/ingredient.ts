import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Ingredient = sequelize.define(
  'Ingredient',
  {
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'ingredients',
    timestamps: false,
  }
);

export default Ingredient;
