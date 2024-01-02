import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const Food_Ingredient = sequelize.define(
  'Food_Ingredient',
  {
    food_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
    },
    ingredient_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: 'food_ingredients',
    timestamps: false,
  }
);

export default Food_Ingredient;
