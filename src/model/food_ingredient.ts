import { DataTypes } from 'sequelize';
import { sequelize } from '../db';
import Food from './food';
import Ingredient from './ingredient';

const Food_Ingredient = sequelize.define(
  'Food_Ingredient',
  {
    food_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Food,
        key: 'id',
      },
    },
    ingredient_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Ingredient,
        key: 'id',
      },
    },
  },
  {
    tableName: 'food_ingredients',
    timestamps: false,
  }
);

export default Food_Ingredient;
