import { DataTypes } from 'sequelize';
import { sequelize } from '../db';
import User from './user';
import Ingredient from './ingredient';

const User_Ingredient = sequelize.define(
  'User_Ingredient',
  {
    userId: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: User,
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

export default User_Ingredient;