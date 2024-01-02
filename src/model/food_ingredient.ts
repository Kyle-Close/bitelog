import { DataTypes } from 'sequelize';
import { sequelize } from '../db';
import Ingredient from './ingredient';
import User_food from './user_food';

const Food_Ingredient = sequelize.define(
  'Food_Ingredient',
  {
    foodId: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: User_food,
        key: 'id',
      },
    },
    ingredientId: {
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
