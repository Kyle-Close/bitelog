import { DataTypes } from 'sequelize';
import { sequelize } from '../db';
import Ingredient from './ingredient';
import User_Food from './user_food';

const Food_Ingredient = sequelize.define(
  'Food_Ingredient',
  {
    FoodId: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: User_Food,
        key: 'id',
      },
    },
    IngredientId: {
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
