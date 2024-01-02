import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const User_Ingredient = sequelize.define(
  'User_Ingredient',
  {
    user_id: {
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

export default User_Ingredient;
